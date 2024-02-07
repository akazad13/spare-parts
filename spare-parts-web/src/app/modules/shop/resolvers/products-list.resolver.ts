import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ProductsList } from '../../../interfaces/list';
import { Observable } from 'rxjs';
import { parseProductsListParams } from '../../../functions/utils';
import { ShopApi } from '../../../api/base';

@Injectable()
export class ProductsListResolver implements Resolve<ProductsList> {
    constructor(
        private shop: ShopApi,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductsList> {
        const categorySlug = route.params.categorySlug || route.data.categorySlug;
        const options = parseProductsListParams(route.queryParams);

        return this.shop.getProductsList({
            ...options,
            filters: {
                ...options.filters,
                category: categorySlug,
            },
        });
    }
}
