import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../../../services/cart.service';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UrlService } from '../../../../services/url.service';

@Component({
    selector: 'app-page-cart',
    templateUrl: './page-cart.component.html',
    styleUrls: ['./page-cart.component.scss'],
})
export class PageCartComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject();

    items: CartItem[] = [];
    quantityControls: FormControl[] = [];

    updating = false;

    constructor(
        public cart: CartService,
        public url: UrlService,
    ) { }

    ngOnInit(): void {
        this.cart.items$.pipe(takeUntil(this.destroy$)).subscribe(items => {
            this.items = items;
            this.quantityControls = items.map(item => new FormControl(item.quantity));
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    update(): void {
        const entries = [];

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const quantityControl = this.quantityControls[i];

            if (item.quantity !== quantityControl.value) {
                entries.push({
                    item,
                    quantity: quantityControl.value,
                });
            }
        }

        if (entries.length <= 0) {
            return;
        }

        this.updating = true;
        this.cart.update(entries).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => this.updating = false,
        });
    }

    needUpdate(): boolean {
        let needUpdate = false;

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const quantityControl = this.quantityControls[i];

            if (!quantityControl.valid) {
                return false;
            }

            if (quantityControl.value !== item.quantity) {
                needUpdate = true;
            }
        }

        return needUpdate;
    }
}
