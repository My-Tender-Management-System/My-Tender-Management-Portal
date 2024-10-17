import {Component, Inject} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IUserProfile } from './layout/Userprofile/user-profile.dto'; 
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-inlinemenu',
    templateUrl: './app.inlinemenu.component.html',
    animations: [
        trigger('inline', [
            state('hidden', style({
                height: '0px',
                overflow: 'hidden'
            })),
            state('visible', style({
                height: '*',
            })),
            state('hiddenAnimated', style({
                height: '0px',
                overflow: 'hidden'
            })),
            state('visibleAnimated', style({
                height: '*',
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppInlineMenuComponent {
    constructor(public appMain: AppMainComponent, public auth: AuthService, @Inject(DOCUMENT) private doc: Document) {}

    ProfileData: IUserProfile | undefined ;

    ngOnInit() {
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
