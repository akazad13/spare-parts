import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem, CartService } from '../../../services/cart.service';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appRemoveFromCart]',
    exportAs: 'removeFromCart',
})
export class RemoveFromCartDirective implements OnDestroy {
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

    remove(item: CartItem): void {
        if (this.inProgress) {
            return;
        }

        this.inProgress = true;
        this.cart.remove(item).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                this.inProgress = false;
                this.cd.markForCheck();
            },
        });
    }
}
