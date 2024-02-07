import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CheckoutGuard implements CanActivate {
    constructor(
        private cart: CartService,
        private router: Router,
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.cart.quantity$.pipe(
            map(quantity => {
                if (quantity) {
                    return true;
                }

                this.router.navigateByUrl('/shop/cart').then();

                return false;
            }),
        );
    }
}
