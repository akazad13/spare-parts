import { EventEmitter, Injectable } from '@angular/core';
import { ProductsList } from '../../../interfaces/list';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Product } from '../../../interfaces/product';
import { GetProductsListOptions } from '../../../api/base';
import { ActiveFilter, Filter } from '../../../interfaces/filter';
import { filterHandlers } from '../filters/filter-handlers';


@Injectable()
export class PageShopService {
    private listSubject$: ReplaySubject<ProductsList> = new ReplaySubject<ProductsList>(1);

    private optionsState: GetProductsListOptions = {};

    private listState: ProductsList;

    private removedFiltersState: ActiveFilter[] = [];

    /**
     * All active filters.
     */
    private activeFiltersSubject$: BehaviorSubject<ActiveFilter[]> = new BehaviorSubject<ActiveFilter[]>([]);

    /**
     * Active filters except removed ones.
     */
    private currentFiltersSubject$: BehaviorSubject<ActiveFilter[]> = new BehaviorSubject<ActiveFilter[]>([]);

    isLoading = false;

    get options(): GetProductsListOptions {
        return this.optionsState;
    }

    get activeFilters(): ActiveFilter[] {
        return this.activeFiltersSubject$.value;
    }

    // getters for list
    get items(): Product[] { return this.listState.items; }
    get page(): number { return this.listState.page; }
    get limit(): number { return this.listState.limit; }
    get sort(): string { return this.listState.sort; }
    get total(): number { return this.listState.total; }
    get pages(): number { return this.listState.pages; }
    get from(): number { return this.listState.from; }
    get to(): number { return this.listState.to; }
    get filters(): Filter[] { return this.listState.filters; }

    readonly optionsChange$: EventEmitter<GetProductsListOptions> = new EventEmitter<GetProductsListOptions>();

    readonly activeFilters$: Observable<ActiveFilter[]> = this.activeFiltersSubject$.asObservable();

    readonly currentFilters$: Observable<ActiveFilter[]> = this.currentFiltersSubject$.asObservable();

    readonly list$: Observable<ProductsList> = this.listSubject$.asObservable();

    readonly defaultOptions: Required<GetProductsListOptions> = {
        page: 1,
        limit: 16,
        sort: 'default',
        filters: {},
    };

    constructor() { }

    setList(list: ProductsList): void {
        this.listState = list;
        this.listSubject$.next(this.listState);

        const filtersWithHandlers = this.listState.filters
            .map(filter => ({filter, handler: filterHandlers.find(x => x.type === filter.type)}))
            .filter(x => x.handler);

        const activeFilters = filtersWithHandlers.reduce((acc, {filter, handler}) => {
            return [...acc, ...handler.activeFilters(filter)];
        }, []);

        this.removedFiltersState = [];
        this.activeFiltersSubject$.next(activeFilters);
        this.currentFiltersSubject$.next(activeFilters);

        const filters: GetProductsListOptions['filters'] = {};

        filtersWithHandlers.forEach(({filter, handler}) => {
            filters[filter.slug] = handler.serialize(filter.value);
        });

        this.optionsState = {
            page: list.page,
            limit: list.limit,
            sort: list.sort,
            filters,
        };
    }

    setOptionValue(optionSlug: string, optionValue: any): void {
        this.setOptions({
            ...this.optionsState,
            page: 1,
            [optionSlug]: optionValue,
        });
    }

    setFilterValue(filterSlug: string, filterValue: string): void {
        this.setOptions({
            ...this.optionsState,
            page: 1,
            filters: {
                ...this.options.filters,
                [filterSlug]: filterValue,
            },
        });
    }

    resetFilter(activeFilter: ActiveFilter): void {
        const handler = filterHandlers.find(x => x.type === activeFilter.type);

        if (!handler) {
            return;
        }

        const removedFilters = [...this.removedFiltersState, activeFilter];
        // All removed filters with the same slug.
        const all = removedFilters.filter(x => x.original.slug === activeFilter.original.slug);

        this.setFilterValue(activeFilter.original.slug, handler.getResetValue(all));
        this.setRemovedFilters(removedFilters);
    }

    resetAllFilters(): void {
        this.setOptions({
            ...this.optionsState,
            page: 1,
            filters: {},
        });
        this.setRemovedFilters(this.activeFilters);
    }

    private setOptions(options: GetProductsListOptions): void {
        this.optionsState = options;
        this.optionsChange$.emit(options);
    }

    private setRemovedFilters(removedFilters: ActiveFilter[]): void {
        this.removedFiltersState = removedFilters;
        this.currentFiltersSubject$.next(this.activeFilters.filter(x => removedFilters.indexOf(x) === -1));
    }
}
