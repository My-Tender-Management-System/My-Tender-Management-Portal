import {Component, OnInit} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {Table} from 'primeng/table';
import {filter, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {DomSanitizer} from '@angular/platform-browser';
import { roleConfig } from 'src/app/layout/roleConfig/roleConfig';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { CamelCaseToTitlePipe } from 'src/app/camel-case-to-title.pipe';
import { ShowFilesComponent } from '../show-files/show-files.component';
import {IUser,UserDto} from "../../dto/User.dto";
import {UserService} from "../../services/User.service";
import {CreateUpdateUser } from "./create-update-user/create-update-user";

import { getDtoNameById } from 'src/app/layout/relationshipConfig/reationshipConfig';

@Component({
    selector: 'app-user',
    templateUrl: './User.component.html',
    providers: [CamelCaseToTitlePipe]
})

export class UserComponent implements OnInit {

    UserData: UserDto[] = [];

    isDataLoading: boolean = false;
    canUpdate:boolean = true;
    canDelete:boolean = true;
    roleConfig=roleConfig

    
    dtoName :string | undefined = "User"
    



    

    private subscription: Subscription = new Subscription();


    constructor(private route:ActivatedRoute,private sanitizer: DomSanitizer,private userService: UserService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router,  private dialogService: DialogService, private breadcrumbService: AppBreadcrumbService, private camelCaseToTitle:CamelCaseToTitlePipe) {
        this.breadcrumbService.setItems([
            {label: this.camelCaseToTitle.transform('User')},
        ]);
    }

    ngOnInit() {

        
                this.findAllUser({})
                this.isDataLoading = true;
        
        
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    navigateToCreateUser() {
        this.router.navigate(['profile/create'])
    }

      downloadFile() {
        this.userService.downloadFile().subscribe(
            (response: HttpResponse<Blob>) => {
                // Extract filename from content-disposition header
                const contentDispositionHeader: string | null =
                    response.headers.get('content-disposition');
                const filename: string = this.getFilenameFromContentDisposition(
                    contentDispositionHeader
                );

                if (response.body) {
                    // Create URL for the blob data
                    const blobUrl: string = window.URL.createObjectURL(
                        response.body
                    );
                    // Create an anchor element and trigger download
                    const a = document.createElement('a');
                    document.body.appendChild(a);
                    a.href = blobUrl;
                    a.download = filename;
                    a.click();

                    // Clean up
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(a);
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Download Successfull',
                    detail: ` Excel successfully downloaded.`,
                    life: 3000,
                });
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Download Failed',
                    detail: ` Failed to download excel.`,
                    life: 3000,
                });
            }
        );
    }


    private getFilenameFromContentDisposition(header: string | null): string {
        const today = new Date();
        const date = today.toISOString().slice(0, 10);

        if (!header) {
            return 'Users_' + date + '.csv';
        }
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(header);
        if (!matches || !matches[1]) {
            return 'Users_' + date + '.csv';
        }
        return matches[1].replace(/['"]/g, '');
    }

    uploadFile(event: any) {
    const file: File = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('file', file);

    this.userService.uploadFile(formData).subscribe(
        (response) => {
            // Handle success
            this.messageService.add({
                severity: 'success',
                summary: 'Upload Successful',
                detail: `File "${file.name}" successfully uploaded.`,
                life: 3000,
            });
        },
        (error) => {
            // Handle error
            this.messageService.add({
                severity: 'error',
                summary: 'Upload Failed',
                detail: `Failed to upload file "${file.name}".`,
                life: 3000,
            });
        }
    );
    }

    

    //--find all--
    findAllUser(params: any) {
    this.subscription.add(
                this.userService.findAllUser(params).pipe(
                filter((res: HttpResponse<IUser[]>) => res.ok),
                map((res: HttpResponse<IUser[]>) => res.body)
            )
                .subscribe(
                    (res: IUser[] | null) => {
                        if (res != null) {
                            this.UserData = res;
                        } else {
                            this.UserData = [];
                        }
                        this.isDataLoading = false;
                    },

                    (res: HttpErrorResponse) => console.log("error in extracting all User", res)
                )
            );
        }
    
    //dynamic dialog
    showCreateUserDialog() {
        
                this.showCreateUserDialogDefault()
        
    }


    
    //dynamic dialog
    showCreateUserDialogDefault() {
        const ref = this.dialogService.open(CreateUpdateUser, {
            header: 'Create ' + this.camelCaseToTitle.transform('User'),
            width: '60%',
            contentStyle: {
                "max-height": "500px",
                "overflow": "auto",
                "border-bottom-left-radius": "0.25rem",
                "border-bottom-right-radius": "0.25rem",
                "border-top-width": "1px",
                "border-top-style": "solid",
                "border-width": "0px",
                "border-style": "solid",
                "border-color": "#e4e4e4",
                "baseZIndex": "10000",
                "closable": "true"
            }
        })
        ref.onClose.subscribe(() => {
            this.findAllUser({})
        })
    }
    


    showEditUserDialog(User: UserDto) {
        const ref = this.dialogService.open(CreateUpdateUser , {
            data: User,
           header: 'Update ' + this.camelCaseToTitle.transform('User'),
            width: '60%',
            contentStyle: {
                "max-height": "500px",
                "overflow": "auto",
                "border-bottom-left-radius": "0.25rem",
                "border-bottom-right-radius": "0.25rem",
                "border-top-width": "1px",
                "border-top-style": "solid",
                "border-width": "0px",
                "border-style": "solid",
                "border-color": "#e4e4e4",
                "baseZIndex": "10000",
                "closable": "true"
            }
        })
        ref.onClose.subscribe(() => {
            this.findAllUser({})
        })
    }

    //delete User
    deleteUser(User: UserDto) {
        this.confirmationService.confirm({
           message: `Are you sure that you want to delete ?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ConfirmDeleteUser(User)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Deleted',
                    detail: 'You have deleted ' 
                });
            },
        });
    }
ConfirmDeleteUser(User: UserDto) {
    this.UserData = this.UserData.filter(val => val.UserId !== User.UserId);
    this.subscription.add(
        this.userService.deleteUser({ userId: User.UserId }).subscribe(() => {
        })
    );
}    //remove html meta data
    removeHtmlTags(description: string): string {
        return description.replace(/<[^>]*>/g, '');
    }



    hasAccess(dtoId: string, accessType: string): boolean {
        const roleName = localStorage.getItem('roleName');

        if (roleName !== null) {
            // console.log(roleName);
            const rolePermissions = roleConfig[roleName];

            if (rolePermissions && rolePermissions[dtoId]) {
                if (rolePermissions[dtoId]?.includes(accessType)) {
                    return true;
                } else {
                    if (accessType == 'DELETE') {
                        this.canDelete = false;
                    }
                    if (accessType == 'UPDATE') {
                        this.canUpdate = false;
                    }
                }
            }
        }
        return false;
    }

    
        
    
        
    
        
    
        
    
        
    
        
    

      

}
