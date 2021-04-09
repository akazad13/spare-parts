import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
    @Input() items = [];

    @Input() withPageTitle = false;

    @Input() afterHeader = true;

    @HostBinding('class.breadcrumb') classBreadcrumb = true;

    @HostBinding('attr.aria-label') attrAriaLabel = 'breadcrumb';

    constructor() { }
}
