import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import { CartService } from '../../../../services/cart.service';
import { UrlService } from '../../../../services/url.service';

@Component({
    selector: 'app-dropcart',
    templateUrl: './dropcart.component.html',
    styleUrls: ['./dropcart.component.scss'],
})
export class DropcartComponent {
    @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

    @HostBinding('class.dropcart') classDropcart = true;

    constructor(
        public cart: CartService,
        public url: UrlService,
    ) { }
}
