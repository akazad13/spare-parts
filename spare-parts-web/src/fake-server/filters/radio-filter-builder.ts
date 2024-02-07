import { BaseFilterItem, RadioFilter } from '../../app/interfaces/filter';
import { Product } from '../../app/interfaces/product';
import { products as dbProducts } from '../database/products';
import { AbstractFilterBuilder } from './abstract-filter-builder';

export class RadioFilterBuilder extends AbstractFilterBuilder {
    private items: BaseFilterItem[] = [];

    private value: string = null;

    test(product: Product): boolean {
        return this.extractItems(product).map(x => x.slug).includes(this.value);
    }

    makeItems(products: Product[], value: string): void {
        products.forEach(product => this.extractItems(product).forEach(item => {
            if (!this.items.find(x => x.slug === item.slug)) {
                this.items.push(item);
            }
        }));

        this.value = value || this.items[0].slug;
    }

    calc(filters: AbstractFilterBuilder[]): void {
        const products = dbProducts.filter(
            product => filters.reduce(
                (isMatched, filter) => {
                    return isMatched && (filter === this || filter.test(product));
                },
                true,
            ),
        );

        this.items.forEach(item => item.count = products.reduce((acc, product) => {
            return acc + (this.extractItems(product).map(x => x.slug).includes(item.slug) ? 1 : 0);
        }, 0));
    }

    build(): RadioFilter {
        return {
            type: 'radio',
            slug: this.slug,
            name: this.name,
            items: this.items,
            value: this.value,
        };
    }

    private extractItems(product: Product): BaseFilterItem[] {
        if (this.slug === 'discount') {
            const items: BaseFilterItem[] = [
                {slug: 'any', name: 'Any', count: 0},
            ];

            if (product.compareAtPrice) {
                items.push({slug: 'yes', name: 'Yes', count: 0});
            } else {
                items.push({slug: 'no', name: 'No', count: 0});
            }

            return items;
        }

        throw Error();
    }
}
