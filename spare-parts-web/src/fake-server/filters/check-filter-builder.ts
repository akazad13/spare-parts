import { BaseFilterItem, CheckFilter } from '../../app/interfaces/filter';
import { Product } from '../../app/interfaces/product';
import { products as dbProducts } from '../database/products';
import { AbstractFilterBuilder } from './abstract-filter-builder';

export class CheckFilterBuilder extends AbstractFilterBuilder {
    private items: BaseFilterItem[] = [];

    private value: string[] = [];

    test(product: Product): boolean {
        if (this.value.length === 0) {
            return true;
        }

        return this.value.reduce((result, value) => {
            return result || this.extractItems(product).map(x => x.slug).includes(value);
        }, false);
    }

    makeItems(products: Product[], value: string): void {
        products.forEach(product => this.extractItems(product).forEach(item => {
            if (!this.items.find(x => x.slug === item.slug)) {
                this.items.push(item);
            }
        }));

        this.value = this.parseValue(value);
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

    build(): CheckFilter {
        return {
            type: 'check',
            slug: this.slug,
            name: this.name,
            items: this.items,
            value: this.value,
        };
    }

    private parseValue(value: string): string[] {
        return value ? value.split(',') : [];
    }

    private extractItems(product: Product): BaseFilterItem[] {
        if (this.slug === 'brand') {
            return product.brand ? [{
                slug: product.brand.slug,
                name: product.brand.name,
                count: 0,
            }] : null;
        }

        throw Error();
    }
}
