import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { PageShopService } from '../../services/page-shop.service';
import { Subject } from 'rxjs';
import { Filter } from '../../../../interfaces/filter';
import { map, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { filterHandlers } from '../../filters/filter-handlers';

@Component({
    selector: 'app-widget-filters',
    templateUrl: './widget-filters.component.html',
    styleUrls: ['./widget-filters.component.scss'],
})
export class WidgetFiltersComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    filters: Filter[] = [];

    form: FormGroup;

    @Input() offcanvasSidebar: 'always' | 'mobile';

    @HostBinding('class.widget') classWidget = true;

    @HostBinding('class.widget-filters') classWidgetFilters = true;

    @HostBinding('class.widget-filters--offcanvas--always') get classWidgetFiltersOffcanvasAlways(): boolean {
        return this.offcanvasSidebar === 'always';
    }

    @HostBinding('class.widget-filters--offcanvas--mobile') get classWidgetFiltersOffcanvasMobile(): boolean {
        return this.offcanvasSidebar === 'mobile';
    }

    constructor(
        private page: PageShopService,
        private fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.page.list$.pipe(
            map(x => x.filters),
            takeUntil(this.destroy$),
        ).subscribe(filters => {
            this.filters = filters;

            const filtersWithHandlers = this.page.filters
                .map(filter => ({filter, handler: filterHandlers.find(x => x.type === filter.type)}))
                .filter(x => x.handler);

            const fields: {[filterSlug: string]: FormControl} = {};

            filtersWithHandlers.forEach(({filter, handler}) => {
                fields[filter.slug] = this.fb.control(filter.value);
                fields[filter.slug].valueChanges.subscribe(value => {
                    this.page.setFilterValue(filter.slug, handler.serialize(value));
                });
            });

            this.form = this.fb.group(fields);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    trackBySlug(index: number, filter: Filter): string {
        return filter.slug;
    }
}
