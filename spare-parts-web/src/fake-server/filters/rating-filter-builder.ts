import { RatingFilter, RatingFilterItem } from '../../app/interfaces/filter';
import { Product } from '../../app/interfaces/product';
import { products as dbProducts } from '../database/products';
import { AbstractFilterBuilder } from './abstract-filter-builder';

export class RatingFilterBuilder extends AbstractFilterBuilder {
    private items: RatingFilterItem[] = [];

    private value: number[] = [];

    test(product: Product): boolean {
        if (this.value.length === 0) {
            return true;
        }

        return this.value.reduce((acc, value) => acc || this.extractItem(product).rating === value, false);
    }

    makeItems(products: Product[], value: string): void {
        products.forEach(product => {
            const item = this.extractItem(product);

            if (!this.items.find(x => x.rating === item.rating)) {
                this.items.push(item);
            }
        });

        this.value = this.parseValue(value);
        this.items.sort((a, b) => b.rating - a.rating);
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
            return acc + (item.rating === this.extractItem(product).rating ? 1 : 0);
        }, 0));
    }

    build(): RatingFilter {
        return {
            type: 'rating',
            slug: this.slug,
            name: this.name,
            items: this.items,
            value: this.value,
        };
    }

    private parseValue(value: string): number[] {
        return value ? value.split(',').map(x => parseFloat(x)) : [];
    }

    private extractItem(product: Product): RatingFilterItem {
        return {
            rating: Math.round(product.rating),
            count: 0,
        };
    }
}
