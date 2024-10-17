import { Component, OnInit } from "@angular/core";
import { RoleConfigService } from "src/services/role-config.service";
import { AuthService } from "@auth0/auth0-angular";
import { RoleConfig } from "./layout/roleConfig/roleConfig";
import { AppComponent } from "./app.component";
import { AppMainComponent } from "./app.main.component";
import { CamelCaseToTitlePipe } from "./camel-case-to-title.pipe";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-menu",
    templateUrl: "./app.menu.component.html",
    providers: [CamelCaseToTitlePipe],
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    filteredModel: any[] = [];
    userRole: string | null = null;
    roleConfig: RoleConfig = {};
    companyLogo: any;

    constructor(
        public app: AppComponent,
        public appMain: AppMainComponent,
        private authService: AuthService,
        private roleConfigService: RoleConfigService,
        private camelCaseToTitle: CamelCaseToTitlePipe
    ) {}

    //--get required roles array--
    getRolesForService(serviceId: string): string[] {
        const roles: string[] = [];
        for (const role in this.roleConfig) {
            if (this.roleConfig[role][serviceId] !== undefined) {
                roles.push(role);
            }
        }
        return roles;
    }

    //--render menu--
    filterMenu() {
        if (this.userRole !== null) {
            this.filteredModel = this.model.map((section) => ({
                ...section,
                items: (section.items || []).filter((item: any) => {
                    if (item.label === "Dashboard") {
                        return true;
                    }

                    return (
                        item.roles &&
                        Array.isArray(item.roles) &&
                        item.roles.includes(this.userRole as string)
                    );
                }),
            }));
        }
    }

    ngOnInit() {
        if (environment.CompanyLogo) {
            this.companyLogo = environment.CompanyLogo;
        } else {
            this.companyLogo = undefined;
        }
        this.roleConfigService.roleConfig$.subscribe((config) => {
            this.roleConfig = config;

            // Initialize model with roles
            this.model = [
                {
                    label: "Overview",
                    icon: "pi pi-fw pi-home",
                    items: [
                        {
                            label: "Dashboard",
                            materialIcon: "dashboard",
                            routerLink: ["/"],
                        },
                        // Generated Pages
                        // {
                        //     label: this.camelCaseToTitle.transform("User"),
                        //     materialIcon: "account_circle",
                        //     roles: this.getRolesForService("DTO2784"),
                        //     routerLink: ["pages/user"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform("Role"),
                        //     materialIcon: "guardian",
                        //     roles: this.getRolesForService("DTO2786"),
                        //     routerLink: ["pages/role"],
                        // },
                        {
                            label: this.camelCaseToTitle.transform("Tenders"),
                            materialIcon: "news",
                            roles: this.getRolesForService("DTO2791"),
                            routerLink: ["pages/tender"],
                        },
                        // {
                        //     label: this.camelCaseToTitle.transform("Updates"),
                        //     materialIcon: "update",
                        //     roles: this.getRolesForService("DTO2804"),
                        //     routerLink: ["pages/updates"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform(
                        //         "TenderTeam"
                        //     ),
                        //     materialIcon: "groups_2",
                        //     roles: this.getRolesForService("DTO2805"),
                        //     routerLink: ["pages/tenderteam"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform(
                        //         "Equipments"
                        //     ),
                        //     materialIcon: "package_2",
                        //     roles: this.getRolesForService("DTO2807"),
                        //     routerLink: ["pages/equipments"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform(
                        //         "EvaluationCommittee"
                        //     ),
                        //     materialIcon: "diversity_3",
                        //     roles: this.getRolesForService("DTO2809"),
                        //     routerLink: ["pages/evaluationcommittee"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform(
                        //         "OtherRequirements"
                        //     ),
                        //     materialIcon: "other_admission",
                        //     roles: this.getRolesForService("DTO2810"),
                        //     routerLink: ["pages/otherrequirements"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform("BidBond"),
                        //     materialIcon: "gavel",
                        //     roles: this.getRolesForService("DTO2812"),
                        //     routerLink: ["pages/bidbond"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform("Company"),
                        //     materialIcon: "assured_workload",
                        //     roles: this.getRolesForService("DTO2813"),
                        //     routerLink: ["pages/company"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform(
                        //         "PerfomanceBond"
                        //     ),
                        //     materialIcon: "description",
                        //     roles: this.getRolesForService("DTO2814"),
                        //     routerLink: ["pages/perfomancebond"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform(
                        //         "Notification"
                        //     ),
                        //     materialIcon: "notifications",
                        //     roles: this.getRolesForService("DTO2816"),
                        //     routerLink: ["pages/notification"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform("Member"),
                        //     materialIcon: "person",
                        //     roles: this.getRolesForService("DTO2821"),
                        //     routerLink: ["pages/member"],
                        // },
                        // {
                        //     label: this.camelCaseToTitle.transform(
                        //         "equipmentDetails"
                        //     ),
                        //     materialIcon: "inventory_2",
                        //     roles: this.getRolesForService("DTO2485"),
                        //     routerLink: ["pages/equipmentdetails"],
                        // },
                        // {
                        //     label: "tenderProgress",
                        //     materialIcon: "inventory_2",
                        //     routerLink: ["pages/tenderProgress"],
                        // },
                    ],
                },
                {
                    label: "Tender Configuration",
                    icon: "pi pi-fw pi-home",
                    items: [
                        {
                            label: this.camelCaseToTitle.transform("Updates"),
                            materialIcon: "update",
                            roles: this.getRolesForService("DTO2804"),
                            routerLink: ["pages/updates"],
                        },
                        {
                            label: this.camelCaseToTitle.transform(
                                "TenderTeam"
                            ),
                            materialIcon: "groups_2",
                            roles: this.getRolesForService("DTO2805"),
                            routerLink: ["pages/tenderteam"],
                        },
                        {
                            label: this.camelCaseToTitle.transform(
                                "EvaluationCommittee"
                            ),
                            materialIcon: "diversity_3",
                            roles: this.getRolesForService("DTO2809"),
                            routerLink: ["pages/evaluationcommittee"],
                        },
                        {
                            label: this.camelCaseToTitle.transform(
                                "OtherRequirements"
                            ),
                            materialIcon: "other_admission",
                            roles: this.getRolesForService("DTO2810"),
                            routerLink: ["pages/otherrequirements"],
                        },
                        // {
                        //     label: this.camelCaseToTitle.transform("BidBond"),
                        //     materialIcon: "gavel",
                        //     roles: this.getRolesForService("DTO2812"),
                        //     routerLink: ["pages/bidbond"],
                        // },
                        {
                            label: this.camelCaseToTitle.transform(
                                "equipmentDetails"
                            ),
                            materialIcon: "inventory_2",
                            roles: this.getRolesForService("DTO2485"),
                            routerLink: ["pages/equipmentdetails"],
                        },
                        // {
                        //     label: this.camelCaseToTitle.transform(
                        //         "PerfomanceBond"
                        //     ),
                        //     materialIcon: "description",
                        //     roles: this.getRolesForService("DTO2814"),
                        //     routerLink: ["pages/perfomancebond"],
                        // },
                        {
                            label: this.camelCaseToTitle.transform(
                                "Payments"
                            ),
                            materialIcon: "Payments",
                            roles: this.getRolesForService("DTO2486"),
                            routerLink: ["pages/payments"],
                        },

                        // {
                        //     label: this.camelCaseToTitle.transform(
                        //         "otherPayments"
                        //     ),
                        //     materialIcon: "Payments",
                        //     roles: this.getRolesForService("DTO3082"),
                        //     routerLink: ["pages/otherPayments"],
                        // },
                    ],
                },
                {
                    label: "Manage Master Data",
                    icon: "pi pi-fw pi-home",
                    items: [
                        {
                            label: this.camelCaseToTitle.transform(
                                "Equipments"
                            ),
                            materialIcon: "package_2",
                            roles: this.getRolesForService("DTO2807"),
                            routerLink: ["pages/equipments"],
                        },
                        {
                            label: this.camelCaseToTitle.transform("Company"),
                            materialIcon: "assured_workload",
                            roles: this.getRolesForService("DTO2813"),
                            routerLink: ["pages/company"],
                        },
                        {
                            label: this.camelCaseToTitle.transform("Member"),
                            materialIcon: "person",
                            roles: this.getRolesForService("DTO2821"),
                            routerLink: ["pages/member"],
                        },
                    ],
                },
                {
                    label: "Access & Roles",
                    icon: "pi pi-fw pi-home",
                    items: [
                        {
                            label: this.camelCaseToTitle.transform("User"),
                            materialIcon: "account_circle",
                            roles: this.getRolesForService("DTO2784"),
                            routerLink: ["pages/user"],
                        },
                        {
                            label: this.camelCaseToTitle.transform("Role"),
                            materialIcon: "guardian",
                            roles: this.getRolesForService("DTO2786"),
                            routerLink: ["pages/role"],
                        },

                        // {
                        //         label: this.camelCaseToTitle.transform(
                        //             "Notification"
                        //         ),
                        //         materialIcon: "notifications",
                        //         roles: this.getRolesForService("DTO2816"),
                        //         routerLink: ["pages/notification"],
                        //     },
                    ],
                },
            ];

            // Ensure the user role is set and filter the menu accordingly
            this.authService.user$.subscribe((user) => {
                if (user !== null && user !== undefined) {
                    this.userRole = user["user_metadata"]["role"];
                    this.filterMenu();
                }
            });
        });
    }
}
