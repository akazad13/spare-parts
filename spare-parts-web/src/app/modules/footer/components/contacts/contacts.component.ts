import { Component, HostBinding } from '@angular/core';
import { theme } from '../../../../../data/theme';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
    @HostBinding('class.footer-contacts') classFooterContacts = true;

    theme = theme;

    constructor() { }
}
