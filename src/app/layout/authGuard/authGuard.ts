import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { RoleConfigService } from 'src/services/role-config.service';
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private roleConfigService: RoleConfigService
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        const userRole = localStorage.getItem('roleName');
        return new Promise((resolve) => {
            this.roleConfigService.roleConfig$.subscribe((config) => {
                if (Object.keys(config).length === 0) {
                    console.log('Waiting for role configuration...');
                    setTimeout(() => {
                        this.canActivate(route, state).then(resolve);
                    }, 100);
                    return;
                }
                const dtoId = (route.data?.['requiredRoles'] as string) ?? '';
                const requiredRoles = getRolesForService(dtoId, config);
                const hasRequiredRole = requiredRoles.some(
                    (role) => role === userRole
                );
                if (hasRequiredRole) {
                    resolve(true);
                } else {
                    this.router.navigate(['/notfound']);
                    resolve(false);
                }
            });
        });
    }
    /*  canActivate(): boolean {
        if (localStorage.getItem('userName') !== null  ) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    } */
}
function getRolesForService(serviceId: string, config: any): string[] {
    const roles: string[] = [];
    for (const role in config) {
        if (config[role][serviceId] !== undefined) {
            roles.push(role);
        }
    }
    return roles;
}