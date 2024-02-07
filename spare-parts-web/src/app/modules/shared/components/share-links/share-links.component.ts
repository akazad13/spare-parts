import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-share-links',
    templateUrl: './share-links.component.html',
    styleUrls: ['./share-links.component.scss'],
})
export class ShareLinksComponent {
    @HostBinding('class.share-links') classShareLinks = true;

    constructor() { }
}
