import { Component, Inject } from '@angular/core';
import { AppComponent } from '../app.component';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-accessdenied',
  templateUrl: './app.accessdenied.component.html',
})
export class AppAccessdeniedComponent {
  constructor(public app: AppComponent, public auth: AuthService, @Inject(DOCUMENT) private doc: Document) { }

  ngOnInit() {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
}
}
