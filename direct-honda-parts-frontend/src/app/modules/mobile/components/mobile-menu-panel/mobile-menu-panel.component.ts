import { Component, HostBinding, Input, TemplateRef } from '@angular/core';
import { MobileMenuService } from '../../../../services/mobile-menu.service';

@Component({
    selector: 'app-mobile-menu-panel',
    templateUrl: './mobile-menu-panel.component.html',
    styleUrls: ['./mobile-menu-panel.component.scss'],
})
export class MobileMenuPanelComponent {
    @Input() level = 0;

    @Input() label = '';

    @Input() content: TemplateRef<any>;

    @HostBinding('class.mobile-menu__panel') classMobileMenuPanel = true;

    @HostBinding('style.transform') get styleTransform(): string {
        return `translateX(${this.level * 100}%)`;
    }

    constructor(
        public menu: MobileMenuService,
    ) { }
}
