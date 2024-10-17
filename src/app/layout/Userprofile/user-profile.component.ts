import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter, map, Subscription } from 'rxjs';
import { IUserProfile } from './user-profile.dto';
import { AuthService } from '@auth0/auth0-angular';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';

@Component({
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit{

    ProfileData: IUserProfile | undefined ;
    submitted: boolean = false;

    constructor(public auth: AuthService, public appbreadcrumbservice: AppBreadcrumbService) {
      this.appbreadcrumbservice.setItems([
        {label: 'Profile'},
    ]);
    }

    ngOnInit() {
      this.auth.user$.subscribe((user: any) => {
        if (user) {
          this.ProfileData = user;
        }
      });
    }
    getUserMetadataKeys() {
      return this.ProfileData?.user_metadata ? Object.keys(this.ProfileData.user_metadata) : [];
    }

}
