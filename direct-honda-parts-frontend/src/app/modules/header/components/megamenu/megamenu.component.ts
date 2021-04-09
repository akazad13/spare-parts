import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Megamenu } from '../../../../interfaces/menu';

@Component({
    selector: 'app-megamenu',
    templateUrl: './megamenu.component.html',
    styleUrls: ['./megamenu.component.scss'],
})
export class MegamenuComponent {
    @Input() menu: Megamenu;

    @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();

    @HostBinding('class.megamenu') classMegamenu = true;

    constructor() { }
}
