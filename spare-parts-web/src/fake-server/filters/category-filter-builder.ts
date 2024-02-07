import { ShopCategory } from '../../app/interfaces/category';
import { Product } from '../../app/interfaces/product';
import { shopCategoriesList, shopCategoriesTree } from '../database/categories';
import { prepareCategory } from '../endpoints/categories';
import { CategoryFilter } from '../../app/interfaces/filter';
import { AbstractFilterBuilder } from './abstract-filter-builder';

export class CategoryFilterBuilder extends AbstractFilterBuilder {
    private value: string = null;

    private items: ShopCategory[] = [];

    test(product: Product): boolean {
        return true;
    }

    makeItems(products: Product[], value: string): void {
        this.value = value;

        const category = shopCategoriesList.find(x => x.slug === value);

        if (category) {
            this.items = [prepareCategory(category, 1)];
        } else {
            this.items = shopCategoriesTree.map(x => prepareCategory(x));
        }
    }

    calc(filters: AbstractFilterBuilder[]): void {

    }

    build(): CategoryFilter {
        return {
            type: 'category',
            slug: this.slug,
            name: this.name,
            items: this.items,
            value: this.value,
        };
    }
}
