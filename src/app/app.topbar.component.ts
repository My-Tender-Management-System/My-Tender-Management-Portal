import {Component, Inject} from '@angular/core';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { IUserProfile } from './layout/Userprofile/user-profile.dto';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-left" *ngIf="!companyLogo">
                <a href="#" class="topbar-menu-button" (click)="appMain.onMenuButtonClick($event)" *ngIf="appMain.isOverlay() || appMain.isMobile()">
                    <i class="pi pi-bars"></i>
                </a>

                <a href="#" class="logo">
                    <img  [src]="'assets/layout/images/CGaaS-'+ (app.colorScheme === 'light' ? 'dark' : 'light') + '.png'">
                </a>

                <!-- <a href="#">
                    <img  [src]="'assets/layout/images/appname-'+ (app.colorScheme === 'light' ? 'dark' : 'light') + '.png'" class="app-name"/>
                </a> -->
            </div>
            <div class="layout-topbar-left" *ngIf="companyLogo">
            <a href="#" class="topbar-menu-button" (click)="appMain.onMenuButtonClick($event)" *ngIf="appMain.isOverlay() || appMain.isMobile()">
                    <i class="pi pi-bars"></i>
                </a>

                <a href="#" class="logo">
                    <img  [src]="companyLogo">
                </a>

                <!-- <a href="#">
                    <img  [src]="'assets/layout/images/appname-'+ (app.colorScheme === 'light' ? 'dark' : 'light') + '.png'" class="app-name"/>
                </a> -->
            </div>

            <app-menu></app-menu>

            <div class="layout-topbar-right">
                <ul class="layout-topbar-right-items">
                    <li #profile class="profile-item" [ngClass]="{'active-topmenuitem':appMain.activeTopbarItem === profile}">
                        <a href="#" (click)="appMain.onTopbarItemClick($event,profile)">
                            <img [src]="ProfileData?.picture" alt="Avatar" *ngIf="ProfileData?.picture">
                            <img src="https://evolza-org-bucket.s3.amazonaws.com/cgaas_logo/empty-profile.png" alt="Avatar" *ngIf="!ProfileData?.picture">
                        </a>

                        <ul class="fadeInDown">
                            <li role="menuitem">
                                <a routerLink="/user-profile" (click)="appMain.onTopbarSubItemClick($event)">
                                    <i class="pi pi-fw pi-user"></i>
                                    <span>Profile</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="appMain.onTopbarSubItemClick($event)">
                                    <i class="pi pi-fw pi-cog"></i>
                                    <span>Settings</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="logout()">
                                    <i class="pi pi-fw pi-sign-out"></i>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <!-- <li>
                        <a href="#">
                            <i class="topbar-icon pi pi-fw pi-bell"></i>
                            <span class="topbar-badge">2</span>
                            <span class="topbar-item-name">Notifications</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="topbar-icon pi pi-fw pi-comment"></i>
                            <span class="topbar-badge">5</span>
                            <span class="topbar-item-name">Messages</span>
                        </a>
                    </li> -->
                </ul>
            </div>
        </div>
    `
})
export class AppTopbarComponent {

    ProfileData: IUserProfile | undefined ;
    companyLogo: any

    constructor(public app: AppComponent, public appMain: AppMainComponent, public auth: AuthService,
        @Inject(DOCUMENT) private doc: Document) {}

    ngOnInit() {
        if (environment.CompanyLogo){
            this.companyLogo=environment.CompanyLogo
        } else {
            this.companyLogo=undefined
        }
        this.auth.user$.subscribe((user: any) => {
            if (user) {
            this.ProfileData = user;
            }
        });
        }

        logout() {
            this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
          }

}
