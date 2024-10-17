import {Component} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { AuthService } from '@auth0/auth0-angular';
import { IUserProfile } from './layout/Userprofile/user-profile.dto';

@Component({
    selector: 'app-rightmenu',
    templateUrl: './app.rightmenu.component.html'
})
export class AppRightMenuComponent {
    date: Date;

    constructor(public appMain: AppMainComponent, public auth: AuthService) {}

    ProfileData: IUserProfile | undefined ;

    ngOnInit() {
        this.auth.user$.subscribe((user: any) => {
          if (user) {
            this.ProfileData = user;
          }
        });
      }
}
