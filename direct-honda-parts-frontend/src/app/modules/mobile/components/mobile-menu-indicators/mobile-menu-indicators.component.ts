import { Component, HostBinding } from '@angular/core';
import { CartService } from '../../../../services/cart.service';
import { WishlistService } from '../../../../services/wishlist.service';
import { MobileMenuService } from '../../../../services/mobile-menu.service';

@Component({
    selector: 'app-mobile-menu-indicators',
    templateUrl: './mobile-menu-indicators.component.html',
    styleUrls: ['./mobile-menu-indicators.component.scss'],
})
export class MobileMenuIndicatorsComponent {
    @HostBinding('class.mobile-menu__indicators') classMobileMenuIndicators = true;

    constructor(
        public menu: MobileMenuService,
        public cart: CartService,
        public wishlist: WishlistService,
    ) { }
}
