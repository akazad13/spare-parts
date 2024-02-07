import { Product } from '../../app/interfaces/product';
import { products as dbProducts } from '../database/products';
import { RangeFilter } from '../../app/interfaces/filter';
import { AbstractFilterBuilder } from './abstract-filter-builder';

export class RangeFilterBuilder extends AbstractFilterBuilder {
    private min: number;
    private max: number;
    private value: [number, number];

    test(product: Product): boolean {
        const value = this.extractValue(product);

        return value >= this.value[0] && value <= this.value[1];
    }

    parseValue(value: string): [number, number] {
        return value.split('-').map(x => parseFloat(x)) as [number, number];
    }

    makeItems(products: Product[], value: string): void {
        this.max = dbProducts.reduce((acc, product) => Math.max(acc, this.extractValue(product)), 0);
        this.min = dbProducts.reduce((acc, product) => Math.min(acc, this.extractValue(product)), this.max);

        /** Calculates the number of digits for rounding. */
        let digit = Math.max(Math.ceil(this.max).toString().length - 2, 1);

        digit = Math.pow(10, digit);

        this.max = Math.ceil(this.max / digit) * digit;
        this.min = Math.floor(this.min / digit) * digit;
        this.value = [this.min, this.max];

        if (value) {
            this.value = this.parseValue(value);
        }
    }

    calc(filters: AbstractFilterBuilder[]): void {

    }

    extractValue(product: Product): number {
        if (this.slug === 'price') {
            return product.price;
        }

        throw Error();
    }

    build(): RangeFilter {
        return {
            type: 'range',
            slug: this.slug,
            name: this.name,
            min: this.min,
            max: this.max,
            value: this.value,
        };
    }
}
