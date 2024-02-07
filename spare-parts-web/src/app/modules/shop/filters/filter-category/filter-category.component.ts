import { Component, HostBinding, Input } from '@angular/core';
import { CategoryFilter } from '../../../../interfaces/filter';
import { UrlService } from '../../../../services/url.service';

@Component({
    selector: 'app-filter-category',
    templateUrl: './filter-category.component.html',
    styleUrls: ['./filter-category.component.scss'],
})
export class FilterCategoryComponent {
    @Input() options: CategoryFilter;

    @HostBinding('class.filter-category') classFilterCategories = true;

    constructor(
        public url: UrlService,
    ) { }
}
