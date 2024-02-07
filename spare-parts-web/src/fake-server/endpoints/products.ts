import { Observable, of, throwError } from 'rxjs';
import { ProductsList, ReviewsList } from '../../app/interfaces/list';
import { Product } from '../../app/interfaces/product';
import { products as dbProducts } from '../database/products';
import { shopCategoriesList } from '../database/categories';
import { prepareCategory } from './categories';
import { HttpErrorResponse } from '@angular/common/http';
import { clone, delayResponse } from '../utils';
import { getNextReviewId, reviews } from '../database/reviews';
import { Review } from '../../app/interfaces/review';
import {
    AddProductReviewData,
    GetProductReviewsOptions,
    GetProductsListOptions,
    GetSearchSuggestionsOptions,
    GetSearchSuggestionsResult,
} from '../../app/api/base';
import { AbstractFilterBuilder } from '../filters/abstract-filter-builder';
import { CategoryFilterBuilder } from '../filters/category-filter-builder';
import { VehicleFilterBuilder } from '../filters/vehicle-filter-builder';
import { RangeFilterBuilder } from '../filters/range-filter-builder';
import { CheckFilterBuilder } from '../filters/check-filter-builder';
import { RadioFilterBuilder } from '../filters/radio-filter-builder';
import { RatingFilterBuilder } from '../filters/rating-filter-builder';
import { ColorFilterBuilder } from '../filters/color-filter-builder';

function getProducts(shift: number, categorySlug: string = null): Product[] {
    switch (categorySlug) {
        case 'tires-wheels':
        case 'power-tools': shift += 5; break;
        case 'interior-parts':
        case 'hand-tools': shift += 10; break;
        case 'engine-drivetrain':
        case 'plumbing': shift += 15; break;
    }

    return [...dbProducts.slice(shift), ...dbProducts.slice(0, shift)];
}

export function getProductsList(options?: GetProductsListOptions): Observable<ProductsList> {
    const filterValues = options.filters || {};
    const filters: AbstractFilterBuilder[] = [
        new CategoryFilterBuilder('category', 'Categories'),
        new VehicleFilterBuilder('vehicle', 'Vehicle'),
        new RangeFilterBuilder('price', 'Price'),
        new CheckFilterBuilder('brand', 'Brand'),
        new RadioFilterBuilder('discount', 'With Discount'),
        new RatingFilterBuilder('rating', 'Rating'),
        new ColorFilterBuilder('color', 'Color'),
    ];

    let products = dbProducts.slice(0);

    filters.forEach(filter => filter.makeItems(products, filterValues[filter.slug]));

    // Calculate items count for filter values.
    filters.forEach(filter => filter.calc(filters));

    // Apply filters to products list.
    products = products.filter(product => filters.reduce((mr, filter) => mr && filter.test(product), true));

    const page = options.page || 1;
    const limit = options.limit || 16;
    const sort = options.sort || 'default';
    const total = products.length;
    const pages = Math.ceil(products.length / limit);
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    // Sort items array.
    products = products.sort((a, b) => {
        if (['name_asc', 'name_desc'].includes(sort)) {
            if ( a.name === b.name ) {
                return 0;
            }

            return (a.name > b.name ? 1 : -1) * (sort === 'name_asc' ? 1 : -1);
        }

        return 0;
    });

    const items = products.slice(from - 1, to) as unknown as Array<Product>;

    return delayResponse(of({
        items,
        page,
        limit,
        sort,
        total,
        pages,
        from,
        to,
        filters: filters.map(x => x.build()),
    }), 350);
}

export function getProductBySlug(slug: string): Observable<Product> {
    const product = dbProducts.find(x => x.slug === slug);

    if (!product) {
        return throwError(new HttpErrorResponse({status: 404, statusText: 'Page Not Found'}));
    }

    return of(clone(product));
}

export function getProductReviews(productId: number, options?: GetProductReviewsOptions): Observable<ReviewsList> {
    let items = reviews.slice(0);

    items.sort((a, b) => {
        if (a.date > b.date) {
            return -1;
        }
        if (a.date < b.date) {
            return 1;
        }

        return 0;
    });

    const page = options.page || 1;
    const limit = options.limit || 8;
    const sort = options.sort || 'default';
    const total = items.length;
    const pages = Math.ceil(items.length / limit);
    const from = (page - 1) * limit + 1;
    const to = page * limit;

    items = items.slice(from - 1, to) as unknown as Array<Review>;

    return of({
        items,
        page,
        limit,
        sort,
        total,
        pages,
        from,
        to,
    });
}

export function addProductReview(productId: number, data: AddProductReviewData): Observable<Review> {
    const review: Review = {
        id: getNextReviewId(),
        date: (new Date()).toISOString().substr(0, 10),
        author: data.author,
        avatar: 'assets/images/avatars/avatar-2.jpg',
        rating: data.rating,
        content: data.content,
    };

    reviews.push(review);

    return delayResponse(of(review));
}

export function getProductAnalogs(productId: number): Observable<Product[]> {
    const slugs: string[] = [
        'sunset-brake-kit',
        'specter-brake-kit',
        'brake-kit',
    ];
    const analogs: Product[] = dbProducts.filter(x => slugs.includes(x.slug));

    return of(clone(analogs));
}

export function getRelatedProducts(productId: number, limit: number): Observable<Product[]> {
    limit = limit || 8;

    return of(clone(dbProducts.slice(0, limit)));
}

export function getFeaturedProducts(categorySlug: string, limit: number): Observable<Product[]> {
    limit = limit || 8;

    return delayResponse(of(clone(getProducts(0, categorySlug).slice(0, limit))), 1000);
}

export function getPopularProducts(categorySlug: string, limit: number): Observable<Product[]> {
    limit = limit || 8;

    return delayResponse(of(clone(getProducts(6, categorySlug).slice(0, limit))), 1000);
}

export function getTopRatedProducts(categorySlug: string, limit: number): Observable<Product[]> {
    limit = limit || 8;

    return delayResponse(of(clone(getProducts(12, categorySlug).slice(0, limit))), 1000);
}

export function getSpecialOffers(limit: number): Observable<Product[]> {
    limit = limit || 8;

    return delayResponse(of(clone(getProducts(8).slice(0, limit))), 1000);
}

export function getLatestProducts(limit: number): Observable<Product[]> {
    limit = limit || 8;

    return of(clone(dbProducts.slice(0, limit)));
}

export function getSearchSuggestions(query: string, options?: GetSearchSuggestionsOptions): Observable<GetSearchSuggestionsResult> {
    query = query.toLowerCase();
    options = Object.assign({
        limitProducts: 4,
        limitCategories: 4,
    }, options);

    const resultProducts = dbProducts.filter(x => x.name.toLowerCase().includes(query));
    const resultCategories = shopCategoriesList.filter(x => x.name.toLowerCase().includes(query));

    return of({
        products: resultProducts.slice(0, options.limitProducts),
        categories: resultCategories.slice(0, options.limitCategories).map(x => prepareCategory(x)),
    });
}
