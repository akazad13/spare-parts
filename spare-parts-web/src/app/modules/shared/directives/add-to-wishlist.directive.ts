import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../../../interfaces/product';
import { takeUntil } from 'rxjs/operators';
import { WishlistService } from '../../../services/wishlist.service';

@Directive({
    selector: '[appAddToWishlist]',
    exportAs: 'addToWishlist',
})
export class AddToWishlistDirective implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    inProgress = false;

    constructor(
        private wishlist: WishlistService,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    add(product: Product): void {
        if (this.inProgress) {
            return;
        }

        this.inProgress = true;
        this.wishlist.add(product).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                this.inProgress = false;
                this.cd.markForCheck();
            },
        });
    }
}
