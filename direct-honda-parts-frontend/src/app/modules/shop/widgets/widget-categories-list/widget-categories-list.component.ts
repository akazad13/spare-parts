import { Component, HostBinding, Input } from '@angular/core';
import { Category } from '../../../../interfaces/category';
import { UrlService } from '../../../../services/url.service';

@Component({
    selector: 'app-widget-categories-list',
    templateUrl: './widget-categories-list.component.html',
    styleUrls: ['./widget-categories-list.component.scss'],
})
export class WidgetCategoriesListComponent {
    @Input() categories: Category[] = [];

    @HostBinding('class.card') classCard = true;

    @HostBinding('class.widget') classWidget = true;

    @HostBinding('class.widget-categories-list') classWidgetCategoriesList = true;

    constructor(
        public url: UrlService,
    ) { }
}
