import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopCategory } from '../../interfaces/category';
import { Product } from '../../interfaces/product';
import { Brand } from '../../interfaces/brand';
import { ProductsList, ReviewsList } from '../../interfaces/list';
import { Review } from '../../interfaces/review';
import { Order } from '../../interfaces/order';
import {
    AddProductReviewData,
    CheckoutData,
    GetBrandsOptions,
    GetCategoriesOptions,
    GetCategoryBySlugOptions,
    GetProductReviewsOptions,
    GetProductsListOptions,
    GetSearchSuggestionsOptions,
    GetSearchSuggestionsResult,
    ShopApi,
} from '../base';
import {
    addProductReview,
    checkout,
    getCategories,
    getCategoryBySlug,
    getFeaturedProducts,
    getLatestProducts,
    getPopularProducts,
    getProductAnalogs,
    getProductBySlug,
    getProductReviews,
    getProductsList,
    getRelatedProducts,
    getSearchSuggestions,
    getSpecialOffers,
    getTopRatedProducts,
} from '../../../fake-server/endpoints';
import { getBrands } from '../../../fake-server/endpoints/brands';


@Injectable()
export class FakeShopApi extends ShopApi {
    getCategoryBySlug(slug: string, options?: GetCategoryBySlugOptions): Observable<ShopCategory> {
        return getCategoryBySlug(slug, options);
    }

    getCategories(options?: GetCategoriesOptions): Observable<ShopCategory[]> {
        return getCategories(options);
    }

    getBrands(options?: GetBrandsOptions): Observable<Brand[]> {
        return getBrands(options);
    }

    getProductsList(options?: GetProductsListOptions): Observable<ProductsList> {
        return getProductsList(options);
    }

    getProductBySlug(slug: string): Observable<Product> {
        return getProductBySlug(slug);
    }

    getProductReviews(productId: number, options?: GetProductReviewsOptions): Observable<ReviewsList> {
        return getProductReviews(productId, options);
    }

    addProductReview(productId: number, data: AddProductReviewData): Observable<Review> {
        return addProductReview(productId, data);
    }

    getProductAnalogs(productId: number): Observable<Product[]> {
        return getProductAnalogs(productId);
    }

    getRelatedProducts(productId: number, limit: number): Observable<Product[]> {
        return getRelatedProducts(productId, limit);
    }

    getFeaturedProducts(categorySlug: string, limit: number): Observable<Product[]> {
        return getFeaturedProducts(categorySlug, limit);
    }

    getPopularProducts(categorySlug: string, limit: number): Observable<Product[]> {
        return getPopularProducts(categorySlug, limit);
    }

    getTopRatedProducts(categorySlug: string, limit: number): Observable<Product[]> {
        return getTopRatedProducts(categorySlug, limit);
    }

    getSpecialOffers(limit: number): Observable<Product[]> {
        return getSpecialOffers(limit);
    }

    getLatestProducts(limit: number): Observable<Product[]> {
        return getLatestProducts(limit);
    }

    getSearchSuggestions(query: string, options?: GetSearchSuggestionsOptions): Observable<GetSearchSuggestionsResult> {
        return getSearchSuggestions(query, options);
    }

    checkout(data: CheckoutData): Observable<Order> {
        return checkout(data);
    }
}
