import { BaseCategory } from '../interfaces/category';
import { Params } from '@angular/router';
import { GetProductsListOptions } from '../api/base';

export function getCategoryPath<T extends BaseCategory>(category: T): T[] {
    return category ? [...getCategoryPath(category.parent), category] : [];
}

export function parseProductsListParams(params: Params): GetProductsListOptions {
    const options: GetProductsListOptions = {};

    if (params.page) {
        options.page = parseFloat(params.page);
    }
    if (params.limit) {
        options.limit = parseFloat(params.limit);
    }
    if (params.sort) {
        options.sort = params.sort;
    }

    for (const param of Object.keys(params)) {
        const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

        if (!mr) {
            continue;
        }

        const filterSlug = mr[1];

        if (!('filters' in options)) {
            options.filters = {};
        }

        options.filters[filterSlug] = params[param];
    }

    return options;
}
