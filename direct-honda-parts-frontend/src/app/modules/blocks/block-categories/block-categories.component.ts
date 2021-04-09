import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UrlService } from '../../../services/url.service';
import { Category } from '../../../interfaces/category';

@Component({
    selector: 'app-block-categories',
    templateUrl: './block-categories.component.html',
    styleUrls: ['./block-categories.component.scss'],
})
export class BlockCategoriesComponent implements OnChanges {
    children: Record<string, Category[]>;

    @Input() blockTitle: string;

    @Input() categories: Category[] = [];

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-categories') classBlockCategories = true;

    constructor(
        public url: UrlService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.categories) {
            this.children = {};
            this.categories.forEach(category => {
                this.children[category.slug] = category.children.slice(0, 5);
            });
        }
    }
}
