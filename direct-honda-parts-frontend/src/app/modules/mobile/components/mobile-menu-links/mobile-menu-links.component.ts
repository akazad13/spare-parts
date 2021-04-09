import { Component, EventEmitter, HostBinding, Input, Output, TemplateRef } from '@angular/core';
import { MobileMenuLink } from '../../../../interfaces/mobile-menu-link';
import { MobileMenuService } from '../../../../services/mobile-menu.service';

@Component({
    selector: 'app-mobile-menu-links',
    templateUrl: './mobile-menu-links.component.html',
    styleUrls: ['./mobile-menu-links.component.scss'],
})
export class MobileMenuLinksComponent {
    @Input() items: MobileMenuLink[] = [];

    @Output() itemClick: EventEmitter<MobileMenuLink> = new EventEmitter<MobileMenuLink>();

    @HostBinding('class.mobile-menu__links') classMobileMenuLinks = true;

    constructor(
        private menu: MobileMenuService,
    ) { }

    onItemClick(event: MouseEvent, item: MobileMenuLink, panel: TemplateRef<any>): void {
        if (item.submenu) {
            event.preventDefault();

            this.menu.openPanel(item.title, panel);
        }

        this.itemClick.emit(item);
    }
}
