import { Injectable } from '@angular/core';
import { ShopCategory } from '../../../interfaces/category';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ShopApi } from '../../../api';

@Injectable()
export class CategoryResolver  {
    constructor(
        private shop: ShopApi,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ShopCategory> {
        return this.shop.getCategoryBySlug(route.params.categorySlug || route.data.categorySlug, {depth: 2});
    }
}
