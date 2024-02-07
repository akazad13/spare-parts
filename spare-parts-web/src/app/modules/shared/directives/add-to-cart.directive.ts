import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { CartService } from '../../../services/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appAddToCart]',
    exportAs: 'addToCart',
})
export class AddToCartDirective implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    inProgress = false;

    constructor(
        private cart: CartService,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    add(product: Product, quantity: number = 1): void {
        if (this.inProgress) {
            return;
        }

        this.inProgress = true;
        this.cart.add(product, quantity).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                this.inProgress = false;
                this.cd.markForCheck();
            },
        });
    }
}
