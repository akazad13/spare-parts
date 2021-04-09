import { Component } from '@angular/core';
import { theme } from '../../../../../data/theme';

@Component({
    selector: 'app-page-contact-us-two',
    templateUrl: './page-contact-us-two.component.html',
    styleUrls: ['./page-contact-us-two.component.scss'],
})
export class PageContactUsTwoComponent {
    theme = theme;

    constructor() { }
}
