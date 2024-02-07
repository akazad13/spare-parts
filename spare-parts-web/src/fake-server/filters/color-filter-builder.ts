import { ColorFilter, ColorFilterItem } from '../../app/interfaces/filter';
import { Product, ProductAttribute } from '../../app/interfaces/product';
import { products as dbProducts } from '../database/products';
import { AbstractFilterBuilder } from './abstract-filter-builder';

const colors = [
    {code: 'white', color: '#fff'},
    {code: 'silver', color: '#d9d9d9'},
    {code: 'light-gray', color: '#b3b3b3'},
    {code: 'gray', color: '#808080'},
    {code: 'dark-gray', color: '#666'},
    {code: 'coal', color: '#4d4d4d'},
    {code: 'black', color: '#262626'},
    {code: 'red', color: '#ff4040'},
    {code: 'orange', color: '#ff8126'},
    {code: 'yellow', color: '#ffd333'},
    {code: 'pear-green', color: '#becc1f'},
    {code: 'green', color: '#8fcc14'},
    {code: 'emerald', color: '#47cc5e'},
    {code: 'shamrock', color: '#47cca0'},
    {code: 'shakespeare', color: '#47cccc'},
    {code: 'blue', color: '#40bfff'},
    {code: 'dark-blue', color: '#3d6dcc'},
    {code: 'violet', color: '#7766cc'},
    {code: 'purple', color: '#b852cc'},
    {code: 'cerise', color: '#e53981'},
];

export class ColorFilterBuilder extends AbstractFilterBuilder {
    private items: ColorFilterItem[] = [];

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
        this.items = this.items.sort((a, b) => {
            return colors.findIndex(x => x.code === a.slug) - colors.findIndex(x => x.code === b.slug);
        });
    }

    build(): ColorFilter {
        return {
            type: 'color',
            slug: this.slug,
            name: this.name,
            items: this.items,
            value: this.value,
        };
    }

    private parseValue(value: string): string[] {
        return value ? value.split(',') : [];
    }

    private extractItems(product: Product): ColorFilterItem[] {
        const attribute = product.attributes.find(x => x.slug === this.slug);

        if (!attribute) {
            return [];
        }

        return attribute.values.map(value => ({
            slug: value.slug,
            name: value.name,
            color: this.getColorCode(value.slug),
            count: 0,
        }));
    }

    private getColorCode(slug: string): string {
        return colors.find(x => x.code === slug)?.color || '#000';
    }
}
