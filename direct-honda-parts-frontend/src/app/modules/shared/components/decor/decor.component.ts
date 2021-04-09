import { Component, HostBinding, Input } from '@angular/core';

export type DecorComponentType = 'center' | 'bottom';

@Component({
    selector: 'app-decor',
    templateUrl: './decor.component.html',
    styleUrls: ['./decor.component.scss'],
})
export class DecorComponent {
    @Input() type: DecorComponentType = 'center';

    @HostBinding('class.decor') classDecor = true;

    @HostBinding('class.decor--type--center') get classDecorTypeCenter() {
        return this.type === 'center';
    }
    @HostBinding('class.decor--type--bottom') get classDecorTypeBottom() {
        return this.type === 'bottom';
    }

    constructor() { }
}
