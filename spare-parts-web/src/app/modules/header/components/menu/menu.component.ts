import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { NestedLink } from '../../../../interfaces/link';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
    @Input() items: NestedLink[];

    @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();

    @HostBinding('class.menu') classMenu = true;

    constructor() { }
}
