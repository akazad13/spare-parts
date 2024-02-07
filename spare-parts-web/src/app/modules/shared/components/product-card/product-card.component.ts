import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input, OnChanges,
    OnDestroy,
    OnInit, SimpleChanges,
} from '@angular/core';
import { CurrencyService } from '../../../currency/services/currency.service';
import { Subject } from 'rxjs';
import { skip, takeUntil, tap } from 'rxjs/operators';
import { QuickviewService } from '../../../../services/quickview.service';
import { UrlService } from '../../../../services/url.service';
import { Product, ProductAttribute, ProductCompatibilityResult } from '../../../../interfaces/product';
import { Vehicle } from '../../../../interfaces/vehicle';
import { CurrentVehicleService } from '../../../../services/current-vehicle.service';

export type ProductCardElement = 'actions' | 'status-badge' | 'meta' | 'features' | 'buttons' | 'list-buttons';

export type ProductCardLayout = 'grid' | 'list' | 'table' | 'horizontal';

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnChanges, OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject();

    showingQuickview = false;

    featuredAttributes: ProductAttribute[] = [];

    vehicle: Vehicle = null;

    @Input() product: Product;

    @Input() layout: ProductCardLayout;

    @Input() exclude: ProductCardElement[] = [];

    @HostBinding('class.product-card') classProductCard = true;

    @HostBinding('class.product-card--layout--grid') get classProductCardLayoutGrid(): boolean {
        return this.layout === 'grid';
    }

    @HostBinding('class.product-card--layout--list') get classProductCardLayoutList(): boolean {
        return this.layout === 'list';
    }

    @HostBinding('class.product-card--layout--table') get classProductCardLayoutTable(): boolean {
        return this.layout === 'table';
    }

    @HostBinding('class.product-card--layout--horizontal') get classProductCardLayoutHorizontal(): boolean {
        return this.layout === 'horizontal';
    }

    constructor(
        private cd: ChangeDetectorRef,
        private quickview: QuickviewService,
        public currency: CurrencyService,
        public url: UrlService,
        public currentVehicle: CurrentVehicleService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.product) {
            this.featuredAttributes = this.product.attributes.filter(x => x.featured);
        }
    }

    ngOnInit(): void {
        this.currency.changes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.cd.markForCheck();
        });

        this.currentVehicle.value$.pipe(
            tap(vehicle => this.vehicle = vehicle),
            skip(1),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            this.cd.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    showQuickview(): void {
        if (this.showingQuickview) {
            return;
        }

        this.showingQuickview = true;
        this.quickview.show(this.product).subscribe({
            complete: () => {
                this.showingQuickview = false;
                this.cd.markForCheck();
            },
        });
    }

    compatibility(): ProductCompatibilityResult {
        if (!this.vehicle) {
            return null;
        }

        if (this.product.compatibility === 'all') {
            return 'all';
        }
        if (this.product.compatibility === 'unknown') {
            return 'unknown';
        }
        if (this.product.compatibility.includes(this.vehicle.id)) {
            return 'fit';
        } else {
            return 'not-fit';
        }
    }
}
