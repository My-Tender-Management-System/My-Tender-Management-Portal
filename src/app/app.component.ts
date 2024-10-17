import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { IRole, RoleDto, transformRolesToRoleConfig } from 'src/dto/Role.dto';
import {
    PermissionCategories,
    roleConfig,
} from './layout/roleConfig/roleConfig';
import { RoleService } from 'src/services/Role.service';
import { Subscription, filter, map } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService, User } from '@auth0/auth0-angular';
import { RoleConfigService } from 'src/services/role-config.service';
import { UserService } from 'src/services/User.service';
import { IUser, UserDto } from 'src/dto/User.dto';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    menuMode = 'static';

    layout = 'blue';

    theme = 'blue';

    ripple: boolean;

    colorScheme = 'dark';

    inputRoles: RoleDto[] | null = [];

    user: User | undefined = {};

    userRole: string | undefined = '';

    isDataLoading: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private primengConfig: PrimeNGConfig,
        private roleService: RoleService,
        private userService: UserService,
        private authService: AuthService,
        private roleConfigSerice: RoleConfigService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.ripple = true;

        this.authService.user$.subscribe((user) => {
            if (user !== null) {
                this.user = user;
                this.userRole = this.user?.['user_metadata']['role'];
                if (
                    this.user?.['user_metadata']['workspaceid'] !=
                    environment.WORKSPACEID
                ) {
                    this.router.navigate(['/access']);
                }

                localStorage.setItem('roleName', this.userRole || '');
                this.findAllRole({});
            } else {
                this.userRole = undefined;
            }
        });
    }

    //--create super admin role--
    // createSuperAdminCredentials(role: RoleDto) {
    //     this.subscription.add(
    //         this.roleService
    //             .createRole(role)
    //             .pipe(
    //                 filter((res: HttpResponse<IRole>) => res.ok),
    //                 map((res: HttpResponse<IRole>) => res.body)
    //             )
    //             .subscribe(
    //                 (res: IRole | null) => {
    //                     if (res) {
    //                         this.createSuperAdminUser({
    //                             FirstName: this.user?.given_name,
    //                             LastName: this.user?.family_name,
    //                             RoleId: role.RoleId,
    //                             RoleName: role.Name,
    //                         });
    //                     } else {
    //                         //show error (Failed to create role)--
    //                         this.showErrorConfirm(
    //                             'Failed to create super admin role, please try again!'
    //                         );
    //                         this.isDataLoading = false;
    //                     }
    //                 },
    //                 (error) => {
    //                     //show error (Failed to create role)--
    //                     this.showErrorConfirm(
    //                         'Failed to create super admin role, please try again!'
    //                     );
    //                     this.isDataLoading = false;
    //                 }
    //             )
    //     );
    // }

    createSuperAdminCredentials(role: RoleDto) {
        this.roleConfigSerice
            .SendFirstLoginEmail({
                email: this.user?.email || '',
                userName: this.user?.name || '',
            })
            .subscribe({
                next: (res: HttpResponse<any>) => {
                    console.log('Email sent successfully:', res);
                },
                error: (err) => {
                    console.error('Error sending email:', err);
                },
            });
        this.subscription.add(
            this.roleService
                .createRole(role)
                .pipe(
                    filter((res: HttpResponse<IRole>) => res.ok),
                    map((res: HttpResponse<IRole>) => res.body)
                )
                .subscribe(
                    (res: IRole | null) => {
                        if (res) {
                            const fullName = this.user?.name || '';
                            const nameParts = fullName.split(' ');
                            const firstName = nameParts[0];
                            const lastName = nameParts.slice(1).join(' ');

                            this.createSuperAdminUser({
                                FirstName: firstName,
                                LastName: lastName,
                                RoleId: role.RoleId,
                                RoleName: role.Name,
                                Email: this.user?.email || '',

                            });
                        } else {
                            // Show error (Failed to create role)
                            this.showErrorConfirm(
                                'Failed to create super admin role, please try again!'
                            );
                            this.isDataLoading = false;
                        }
                    },
                    (error) => {
                        // Show error (Failed to create role)
                        this.showErrorConfirm(
                            'Failed to create super admin role, please try again!'
                        );
                        this.isDataLoading = false;
                    }
                )
        );
    }

    //--create super admin user acc--
    createSuperAdminUser(user: UserDto) {
        this.subscription.add(
            this.userService.createUser(user).subscribe(
                () => {
                    //--all done and refresh--
                    window.location.reload();
                },
                (error) => {
                    // Check if the error response indicates that the user already exists
                    if (error.error?.operation === 'Failed' && error.error?.error === 'user already exists') {
                        // Handle the specific error case (user already exists)
                        console.log('User already exists');
                    } else {
                        // Show general error if the error does not match the specific case
                        this.showErrorConfirm(
                            'Failed to create super admin user, please try again!'
                        );
                    }
                    this.isDataLoading = false;
                }
            )
        );
    }

    //--handle authentication rules--
    handleRolesAuthentication() {
        //--check if available role is available--
        if (this.userRole) {
            if (this.userRole == 'Super-Admin') {
                //-check if super admin role available--
                const superAdminRole = this.inputRoles?.find((role) => {
                    return role.Name === 'Super-Admin';
                });
                if (!superAdminRole?.RoleId) {
                    //--create super admin role and user--
                    this.createSuperAdminCredentials({
                        Name: 'Super-Admin',
                        //---!!!!!---this PermissionCategories must be hardcoded when generating app--
                        PermissionCategories: PermissionCategories,
                    });
                } else {
                    //--super admin available--
                    //--check super admin user available--
                    this.validateSuperAdminRoleWithUser(superAdminRole);
                }
            } else {
                const userRoleStruct = this.inputRoles?.find((role) => {
                    return role.Name === this.userRole;
                });
                if (userRoleStruct?.RoleId) {
                    //--ok--
                    this.isDataLoading = false;
                } else {
                    //--show error (no role available in that name)--
                    this.showErrorConfirm(
                        'No role configuration available for user, please try again!'
                    );
                    this.isDataLoading = false;
                }
            }
        } else {
            //--show error (no user role)--
            this.showErrorConfirm(
                'Cannot get role configuration data from auth0, please try again!'
            );
            this.isDataLoading = false;
        }
    }

    // validateSuperAdminRoleWithUser(role: RoleDto) {
    //     this.subscription.add(
    //         this.userService
    //             .findAllUser({})
    //             .pipe(
    //                 filter((res: HttpResponse<IUser[]>) => res.ok),
    //                 map((res: HttpResponse<IUser[]>) => res.body)
    //             )
    //             .subscribe(
    //                 (res: IUser[] | null) => {
    //                     const superAdminUser = res?.find((user) => {
    //                         return user.RoleId === role.RoleId;
    //                     });

    //                     if (!superAdminUser?.UserId) {
    //                         //--no user for role--
    //                         this.createSuperAdminUser({
    //                             FirstName: this.user?.given_name,
    //                             LastName: this.user?.family_name,
    //                             RoleId: role.RoleId,
    //                             RoleName: role.Name,
    //                         });
    //                     } else {
    //                         this.isDataLoading = false;
    //                     }
    //                 },

    //                 (res: HttpErrorResponse) => {
    //                     this.showErrorConfirm(
    //                         'Cannot get role configuration data from user, please try again!'
    //                     );
    //                     this.isDataLoading = false;
    //                 }
    //             )
    //     );
    // }

    validateSuperAdminRoleWithUser(role: RoleDto) {
        this.subscription.add(
            this.userService
                .findAllUser({})
                .pipe(
                    filter((res: HttpResponse<IUser[]>) => res.ok),
                    map((res: HttpResponse<IUser[]>) => res.body)
                )
                .subscribe(
                    (res: IUser[] | null) => {
                        const superAdminUser = res?.find((user) => {
                            return user.RoleId === role.RoleId;
                        });

                        if (!superAdminUser?.UserId) {
                            const fullName = this.user?.name || '';
                            const nameParts = fullName.split(' ');
                            const firstName = nameParts[0];
                            const lastName = nameParts.slice(1).join(' ');

                            //--no user for role--
                            this.createSuperAdminUser({
                                FirstName: firstName,
                                LastName: lastName,
                                RoleId: role.RoleId,
                                RoleName: role.Name,
                                Email: this.user?.email || '',

                            });
                        } else {
                            this.isDataLoading = false;
                        }
                    },

                    (res: HttpErrorResponse) => {
                        this.showErrorConfirm(
                            'Cannot get role configuration data from user, please try again!'
                        );
                        this.isDataLoading = false;
                    }
                )
        );
    }

    //--roles get--
    findAllRole(params: any) {
        this.isDataLoading = true;
        this.subscription.add(
            this.roleService
                .findAllRole(params)
                .pipe(
                    filter((res: HttpResponse<IRole[]>) => res.ok),
                    map((res: HttpResponse<IRole[]>) => res.body)
                )
                .subscribe(
                    (res: IRole[] | null) => {
                        this.inputRoles = res;

                        const newRoleConfig = transformRolesToRoleConfig(
                            this.inputRoles ? this.inputRoles : []
                        );

                        // Merging into the existing roleConfig
                        Object.assign(roleConfig, newRoleConfig);
                        this.roleConfigSerice.setRoleConfig(roleConfig);

                        //--validate roles--
                        this.handleRolesAuthentication();
                    },

                    (res: HttpErrorResponse) => {
                        console.log('error in extracting all Role', res);
                        this.showErrorConfirm(
                            'Cannot get roles configuration data, please try again!'
                        );
                        this.isDataLoading = false;
                    }
                )
        );
    }

    showErrorConfirm(text: string) {
        this.confirmationService.confirm({
            header: 'Error',
            message: text,
            accept: () => {
                window.location.reload();
            },
            rejectVisible: false,
            acceptLabel: 'Ok',
            acceptIcon: '',
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}

