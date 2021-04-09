import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { PageShopGridLayout, PageShopLayout } from '../../pages/page-shop/page-shop.component';
import { ShopSidebarService } from '../../services/shop-sidebar.service';
import { PageShopService } from '../../services/page-shop.service';
import { FormControl } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

export interface LayoutButton {
    layout: PageShopLayout;
    icon: string;
}

@Component({
    selector: 'app-products-view',
    templateUrl: './products-view.component.html',
    styleUrls: ['./products-view.component.scss'],
})
export class ProductsViewComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    isEmptyList$: Observable<boolean>;

    currentFiltersCount$: Observable<number>;

    hasActiveFilters$: Observable<boolean>;

    layoutButtons: LayoutButton[] = [
        {layout: 'grid', icon: 'layout-grid-16'},
        {layout: 'grid-with-features', icon: 'layout-grid-with-details-16'},
        {layout: 'list', icon: 'layout-list-16'},
        {layout: 'table', icon: 'layout-table-16'},
    ];

    pageControl: FormControl;
    limitControl: FormControl;
    sortControl: FormControl;

    @Input() layout: PageShopLayout = 'grid';

    @Input() gridLayout: PageShopGridLayout = 'grid-4-sidebar';

    @Input() offCanvasSidebar: 'always' | 'mobile' = 'mobile';

    @HostBinding('class.products-view') classProductsView = true;

    @HostBinding('class.products-view--loading') get classProductsViewLoading(): boolean {
        return this.page.isLoading;
    }

    constructor(
        public sidebar: ShopSidebarService,
        public page: PageShopService,
    ) { }

    ngOnInit(): void {
        this.pageControl = new FormControl(this.page.defaultOptions.page);
        this.limitControl = new FormControl(this.page.defaultOptions.limit);
        this.sortControl = new FormControl(this.page.defaultOptions.sort);

        merge(
            this.pageControl.valueChanges.pipe(map(v => ['page', v])),
            this.limitControl.valueChanges.pipe(map(v => ['limit', parseFloat(v)])),
            this.sortControl.valueChanges.pipe(map(v => ['sort', v])),
        ).pipe(
            takeUntil(this.destroy$),
        ).subscribe(([option, value]) => {
            this.page.setOptionValue(option, value);
        });

        this.page.list$.pipe(
            takeUntil(this.destroy$),
        ).subscribe(({page, limit, sort}) => {
            this.pageControl.setValue(page, {emitEvent: false});
            this.limitControl.setValue(limit, {emitEvent: false});
            this.sortControl.setValue(sort, {emitEvent: false});
        });

        this.isEmptyList$ = this.page.list$.pipe(map(x => x.total === 0));
        this.currentFiltersCount$ = this.page.currentFilters$.pipe(map(x => x.length));
        this.hasActiveFilters$ = this.page.activeFilters$.pipe(map(x => x.length > 0));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setLayout(value: PageShopLayout): void {
        this.layout = value;
    }

    trackById(index: number, entity: {id: string | number}): string | number {
        return entity.id;
    }
}
