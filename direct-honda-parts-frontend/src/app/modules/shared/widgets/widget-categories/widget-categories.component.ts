import { Component, HostBinding, Input } from '@angular/core';
import { Category } from '../../../../interfaces/category';
import { UrlService } from '../../../../services/url.service';

@Component({
    selector: 'app-widget-categories',
    templateUrl: './widget-categories.component.html',
    styleUrls: ['./widget-categories.component.scss'],
})
export class WidgetCategoriesComponent {
    @Input() widgetTitle: string;

    @Input() categories: Category[] = [];

    @HostBinding('class.card') classCard = true;

    @HostBinding('class.widget') classWidget = true;

    @HostBinding('class.widget-categories') classWidgetCategories = true;

    constructor(
        public url: UrlService,
    ) { }
}
