import { NgModule } from '@angular/core';
import { ExtraOptions, Router, RouterModule, Routes } from '@angular/router';
import { AppMainComponent } from './app.main.component';
import { AuthGuard as Auth0Guard } from '@auth0/auth0-angular';
import { AuthGuard } from './layout/authGuard/authGuard';
import { UserProfileComponent } from './layout/Userprofile/user-profile.component'; 
import { DashboardDemoComponent } from './demo/view/dashboarddemo.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
// Generated Pages
import {UserComponent} from "./../genPages/User/User.component"; 
import {RoleComponent} from "./../genPages/Role/Role.component"; 
import {TenderComponent} from "./../genPages/Tender/Tender.component"; 
import {UpdatesComponent} from "./../genPages/Updates/Updates.component"; 
import {TenderTeamComponent} from "./../genPages/TenderTeam/TenderTeam.component"; 
import {EquipmentsComponent} from "./../genPages/Equipments/Equipments.component"; 
import {EvaluationCommitteeComponent} from "./../genPages/EvaluationCommittee/EvaluationCommittee.component"; 
import {OtherRequirementsComponent} from "./../genPages/OtherRequirements/OtherRequirements.component"; 
import {BidBondComponent} from "./../genPages/BidBond/BidBond.component"; 
import {CompanyComponent} from "./../genPages/Company/Company.component"; 
import {PerfomanceBondComponent} from "./../genPages/PerfomanceBond/PerfomanceBond.component"; 
import {NotificationComponent} from "./../genPages/Notification/Notification.component"; 
import {MemberComponent} from "./../genPages/Member/Member.component"; 

import { RoleConfigService } from 'src/services/role-config.service';
import { EquipmentDetailsComponent } from 'src/genPages/EquipmentDetails/EquipmentDetails.component';
import { TenderProgressComponent } from 'src/genPages/tender-progress/tender-progress.component';
import { PaymentsComponent } from 'src/genPages/payments/payments.component';
import { OtherPaymentsComponent } from 'src/genPages/OtherPayments/OtherPayments.component';
import { TenderRelatedComponent } from 'src/genPages/Tender/tender-related/tender-related.component';
const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};
const routes: Routes = [
    {
        path: '', component: AppMainComponent,canActivate: [Auth0Guard],
        children: [
            { path: '', component: DashboardDemoComponent },
            { path: 'user-profile', component: UserProfileComponent, canActivate: [Auth0Guard] },
           // Generated Pages
        ]
    },
    {path: 'error', component: AppErrorComponent},
    {path: 'access', component: AppAccessdeniedComponent},
    {path: 'notfound', component: AppNotfoundComponent},
    {path: '**', redirectTo: '/notfound'},
];
@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule {
    constructor(private roleConfigService: RoleConfigService, private router: Router) {
        this.roleConfigService.roleConfig$.subscribe(config => {
            // console.log("config in routes", config);
            if (config) {
                // Remove existing dynamic routes
                routes[0].children = routes[0].children!.filter(route => !route.data || !route.data['dynamic']);
                // Add dynamic routes based on role configuration
                routes[0].children.push(
                      {path: 'pages/user', component: UserComponent,canActivate: [AuthGuard],data: { breadcrumb: 'User',requiredRoles: 'DTO2784', dynamic: true } },
					{path: 'pages/role', component: RoleComponent,canActivate: [AuthGuard],data: { breadcrumb: 'Role',requiredRoles: 'DTO2786', dynamic: true } },
					{path: 'pages/tender', component: TenderComponent,canActivate: [AuthGuard],data: { breadcrumb: 'Tender',requiredRoles: 'DTO2791', dynamic: true } },
					{path: 'pages/updates', component: UpdatesComponent,canActivate: [AuthGuard],data: { breadcrumb: 'Updates',requiredRoles: 'DTO2804', dynamic: true } },
					{path: 'pages/tenderteam', component: TenderTeamComponent,canActivate: [AuthGuard],data: { breadcrumb: 'TenderTeam',requiredRoles: 'DTO2805', dynamic: true } },
					{path: 'pages/equipments', component: EquipmentsComponent,canActivate: [AuthGuard],data: { breadcrumb: 'Equipments',requiredRoles: 'DTO2807', dynamic: true } },
					{path: 'pages/evaluationcommittee', component: EvaluationCommitteeComponent,canActivate: [AuthGuard],data: { breadcrumb: 'EvaluationCommittee',requiredRoles: 'DTO2809', dynamic: true } },
					{path: 'pages/otherrequirements', component: OtherRequirementsComponent,canActivate: [AuthGuard],data: { breadcrumb: 'OtherRequirements',requiredRoles: 'DTO2810', dynamic: true } },
					{path: 'pages/bidbond', component: BidBondComponent,canActivate: [AuthGuard],data: { breadcrumb: 'BidBond',requiredRoles: 'DTO2812', dynamic: true } },
					{path: 'pages/company', component: CompanyComponent,canActivate: [AuthGuard],data: { breadcrumb: 'Company',requiredRoles: 'DTO2813', dynamic: true } },
					{path: 'pages/perfomancebond', component: PerfomanceBondComponent,canActivate: [AuthGuard],data: { breadcrumb: 'PerfomanceBond',requiredRoles: 'DTO2814', dynamic: true } },
					{path: 'pages/notification', component: NotificationComponent,canActivate: [AuthGuard],data: { breadcrumb: 'Notification',requiredRoles: 'DTO2816', dynamic: true } },
					{path: 'pages/member', component: MemberComponent,canActivate: [AuthGuard],data: { breadcrumb: 'Member',requiredRoles: 'DTO2821', dynamic: true } },
					{path: 'pages/equipmentdetails', component: EquipmentDetailsComponent,canActivate: [AuthGuard],data: { breadcrumb: 'EquipmentDetails',requiredRoles: 'DTO2485', dynamic: true } },
					{path: 'pages/tenderProgress', component: TenderProgressComponent,data: { breadcrumb: 'tenderProgress',dynamic: true } },
					{path: 'pages/payments', component: PaymentsComponent,canActivate: [AuthGuard],data: { breadcrumb: 'payments',requiredRoles: 'DTO2486', dynamic: true } },
					{path: 'pages/otherPayments', component: OtherPaymentsComponent,canActivate: [AuthGuard],data: { breadcrumb: 'otherPayments',requiredRoles: 'DTO3082', dynamic: true } },
					{path: 'pages/TenderRelated', component: TenderRelatedComponent,data: { breadcrumb: 'TenderRelated',dynamic: true } },
					
                );
                // Re-initialize the router to apply changes
                this.router.resetConfig(routes);
            }
        });
    }
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