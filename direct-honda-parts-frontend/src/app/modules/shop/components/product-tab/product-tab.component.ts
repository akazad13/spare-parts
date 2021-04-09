import { Component, HostBinding, Input } from '@angular/core';

let uniqueId = 0;

@Component({
    selector: 'app-product-tab',
    templateUrl: './product-tab.component.html',
    styleUrls: ['./product-tab.component.scss'],
})
export class ProductTabComponent {
    @Input() @HostBinding('attr.id') id = `product-tab-${++uniqueId}`;

    @Input() label = '';

    @Input() counter = 0;

    @Input() showCounter = false;

    @Input() isActive = false;

    @HostBinding('class.product-tabs__pane') classProductTabsPane = true;

    @HostBinding('class.product-tabs__pane--active') get classProductTabsPaneActive() { return this.isActive; }

    constructor() { }
}
