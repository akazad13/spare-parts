import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-mobile-logo',
    templateUrl: './mobile-logo.component.html',
    styleUrls: ['./mobile-logo.component.scss'],
})
export class MobileLogoComponent {
    @HostBinding('class.mobile-logo') classMobileLogo = true;

    constructor() { }
}
