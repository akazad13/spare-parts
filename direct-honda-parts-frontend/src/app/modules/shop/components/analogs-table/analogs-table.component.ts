import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { ShopApi } from '../../../../api/base';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Product } from '../../../../interfaces/product';
import { UrlService } from '../../../../services/url.service';

@Component({
    selector: 'app-analogs-table',
    templateUrl: './analogs-table.component.html',
    styleUrls: ['./analogs-table.component.scss'],
})
export class AnalogsTableComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private productId$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

    analogs: Product[] = [];

    @Input() set productId(value: number) {
        if (value !== this.productId$.value) {
            this.productId$.next(value);
        }
    }

    @HostBinding('class.analogs-table') classAnalogsTable = true;

    constructor(
        private shop: ShopApi,
        public url: UrlService,
    ) { }

    ngOnInit(): void {
        this.productId$.pipe(
            switchMap(productId => {
                if (!productId) {
                    return of(null);
                }

                return this.shop.getProductAnalogs(productId);
            }),
            takeUntil(this.destroy$),
        ).subscribe(x => this.analogs = x);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
