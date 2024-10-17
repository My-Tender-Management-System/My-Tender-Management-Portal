import {Component} from '@angular/core';
import {AppComponent} from './app.component';

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer">
            <div class="footer-logo-container">
                <img id="footer-logo"   [src]="'assets/layout/images/CGaaS-'+ (app.colorScheme === 'light' ? 'dark' : 'light') + '.png'" alt="atlantis-layout"/>
                <span class="app-name">CGaaS</span>
            </div>
            <span class="copyright">&#169;Evolza - 2024</span>
        </div>
    `
})
export class AppFooterComponent {
    constructor(public app: AppComponent) {}
}
