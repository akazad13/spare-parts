import { Product } from '../../app/interfaces/product';
import { Filter } from '../../app/interfaces/filter';

export abstract class AbstractFilterBuilder {
    constructor(
        public slug: string,
        public name: string,
    ) { }

    abstract test(product: Product): boolean;

    abstract makeItems(products: Product[], value: string): void;

    abstract calc(filters: AbstractFilterBuilder[]): void;

    abstract build(): Filter;
}

