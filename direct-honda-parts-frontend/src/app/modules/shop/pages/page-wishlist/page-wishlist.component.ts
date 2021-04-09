import { Component } from '@angular/core';
import { WishlistService } from '../../../../services/wishlist.service';
import { UrlService } from '../../../../services/url.service';

@Component({
    selector: 'app-page-wishlist',
    templateUrl: './page-wishlist.component.html',
    styleUrls: ['./page-wishlist.component.scss'],
})
export class PageWishlistComponent {
    constructor(
        public wishlist: WishlistService,
        public url: UrlService,
    ) { }
}
