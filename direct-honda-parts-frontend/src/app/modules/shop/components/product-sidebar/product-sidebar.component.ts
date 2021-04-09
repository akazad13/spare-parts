import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../../interfaces/product';
import { ShopApi } from '../../../../api/base';
import { ShopCategory } from '../../../../interfaces/category';

@Component({
    selector: 'app-product-sidebar',
    templateUrl: './product-sidebar.component.html',
    styleUrls: ['./product-sidebar.component.scss'],
})
export class ProductSidebarComponent implements OnInit {
    categories$: Observable<ShopCategory[]>;

    latestProducts$: Observable<Product[]>;

    constructor(
        private shop: ShopApi,
    ) { }

    ngOnInit(): void {
        this.categories$ = this.shop.getCategories({depth: 1});
        this.latestProducts$ = this.shop.getLatestProducts(5);
    }
}
