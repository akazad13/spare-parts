import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ShopSidebarService } from '../../services/shop-sidebar.service';
import { PageShopService } from '../../services/page-shop.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShopApi } from '../../../../api/base';
import { merge, Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { UrlService } from '../../../../services/url.service';
import { Breadcrumb } from '../../../shared/components/block-header/block-header.component';
import { getCategoryPath } from '../../../../functions/utils';
import { ShopCategory } from '../../../../interfaces/category';
import { LanguageService } from '../../../language/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductsList } from '../../../../interfaces/list';
import { CurrentVehicleService } from '../../../../services/current-vehicle.service';
import { filterHandlers } from '../../filters/filter-handlers';

export type PageShopLayout =
    'grid' |
    'grid-with-features' |
    'list' |
    'table';

export type PageShopGridLayout =
    'grid-3-sidebar' |
    'grid-4-sidebar' |
    'grid-4-full' |
    'grid-5-full' |
    'grid-6-full';

export type PageShopSidebarPosition = 'start' | 'end' | false;

export type PageShopOffCanvasSidebar = 'always' | 'mobile';

export interface PageShopData {
    layout: PageShopLayout;
    gridLayout: PageShopGridLayout;
    sidebarPosition: PageShopSidebarPosition;
    category: ShopCategory;
    productsList: ProductsList;
}

@Component({
    selector: 'app-page-shop',
    templateUrl: './page-shop.component.html',
    styleUrls: ['./page-shop.component.scss'],
    providers: [
        ShopSidebarService,
        PageShopService,
        CurrentVehicleService,
    ],
})
export class PageShopComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    layout: PageShopLayout = 'grid';

    gridLayout: PageShopGridLayout = 'grid-4-sidebar';

    sidebarPosition: PageShopSidebarPosition = 'start';

    pageTitle$: Observable<string>;

    breadcrumbs$: Observable<Breadcrumb[]>;

    get offCanvasSidebar(): PageShopOffCanvasSidebar {
        return ['grid-4-full', 'grid-5-full', 'grid-6-full'].includes(this.gridLayout) ? 'always' : 'mobile';
    }

    get hasSidebar(): boolean {
        return this.sidebarPosition && ['grid-3-sidebar', 'grid-4-sidebar'].includes(this.gridLayout);
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private page: PageShopService,
        private shop: ShopApi,
        private location: Location,
        private url: UrlService,
        private language: LanguageService,
        private translate: TranslateService,
    ) { }

    ngOnInit(): void {
        const data$: Observable<PageShopData> = this.route.data as Observable<PageShopData>;

        const category$: Observable<ShopCategory> = data$.pipe(map(data => data.category));

        this.pageTitle$ = category$.pipe(
            switchMap(category => category ? of(category.name) : this.translate.stream('HEADER_SHOP')),
        );

        this.breadcrumbs$ = this.language.current$.pipe(
            switchMap(() => category$.pipe(
                map(category => [
                    {label: this.translate.instant('LINK_HOME'), url: this.url.home()},
                    {label: this.translate.instant('LINK_SHOP'), url: this.url.shop()},
                    ...getCategoryPath(category).map(x => ({label: x.name, url: this.url.category(x)})),
                ]),
            )),
        );

        this.route.data.subscribe((data: PageShopData) => {
            this.layout = data.layout;
            this.gridLayout = data.gridLayout;
            this.sidebarPosition = data.sidebarPosition;
        });

        this.route.data.pipe(
            switchMap((data: PageShopData) => merge(
                of(data.productsList),
                this.page.optionsChange$.pipe(
                    map(() => {
                        this.updateUrl();

                        const categorySlug = this.route.snapshot.params.categorySlug || this.route.snapshot.data.categorySlug || null;

                        return {
                            ...this.page.options,
                            filters: {
                                ...this.page.options.filters,
                                category: categorySlug,
                            },
                        };
                    }),
                    tap(() => this.page.isLoading = true),
                    switchMap(options => this.shop.getProductsList(options)),
                ),
            )),
            takeUntil(this.destroy$),
        ).subscribe(list => {
            this.page.isLoading = false;
            this.page.setList(list);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateUrl(): void {
        const tree = this.router.parseUrl(this.router.url);
        tree.queryParams = this.getQueryParams();
        this.location.replaceState(tree.toString());
    }

    private getQueryParams(): Params {
        const params: Params = {};
        const options = this.page.options;
        const filterValues = options.filters;

        if ('page' in options && options.page !== this.page.defaultOptions.page) {
            params.page = options.page;
        }
        if ('limit' in options && options.limit !== this.page.defaultOptions.limit) {
            params.limit = options.limit;
        }
        if ('sort' in options && options.sort !== this.page.defaultOptions.sort) {
            params.sort = options.sort;
        }
        if ('filters' in options) {
            this.page.filters
                .map(filter => ({
                    filter,
                    handler: filterHandlers.find(x => x.type === filter.type),
                }))
                .filter(x => x.handler && filterValues[x.filter.slug])
                .forEach(({filter, handler}) => {
                    const value = handler.deserialize(filterValues[filter.slug]);

                    if (!handler.isDefaultValue(filter, value)) {
                        params[`filter_${filter.slug}`] = handler.serialize(value);
                    }
                });
        }

        return params;
    }
}
