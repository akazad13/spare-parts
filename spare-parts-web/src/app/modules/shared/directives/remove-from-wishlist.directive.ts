import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WishlistService } from '../../../services/wishlist.service';
import { Product } from '../../../interfaces/product';

@Directive({
    selector: '[appRemoveFromWishlist]',
    exportAs: 'removeFromWishlist',
})
export class RemoveFromWishlistDirective implements OnDestroy {
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

    remove(product: Product): void {
        if (this.inProgress) {
            return;
        }

        this.inProgress = true;
        this.wishlist.remove(product).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                this.inProgress = false;
                this.cd.markForCheck();
            },
        });
    }
}
