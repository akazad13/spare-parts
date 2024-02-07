import { Observable } from 'rxjs';
import { ShopCategory } from '../../interfaces/category';
import { Product } from '../../interfaces/product';
import { Brand } from '../../interfaces/brand';
import { ProductsList, ReviewsList } from '../../interfaces/list';
import { Review } from '../../interfaces/review';
import { Order } from '../../interfaces/order';
import { AddressData } from '../../interfaces/address';

export interface GetCategoryBySlugOptions {
    depth?: number;
}

export interface GetCategoriesOptions {
    parent?: Partial<ShopCategory>;
    slugs?: string[];
    depth?: number;
}

export interface GetBrandsOptions {
    limit?: number;
}

export interface GetProductsListOptions {
    page?: number;
    limit?: number;
    sort?: string;
    filters?: {[slug: string]: string};
}

export interface GetProductReviewsOptions {
    page?: number;
    limit?: number;
    sort?: string;
    filters?: {[slug: string]: string};
}

export interface AddProductReviewData {
    rating: number;
    author: string;
    email: string;
    content: string;
}

export interface GetSearchSuggestionsOptions {
    limitProducts?: number;
    limitCategories?: number;
}

export interface GetSearchSuggestionsResult {
    products: Product[];
    categories: ShopCategory[];
}

export interface CheckoutItemOptionData {
    name: string;
    value: string;
}

export interface CheckoutItemData {
    productId: number;
    options: CheckoutItemOptionData[];
    quantity: number;
}

export interface CheckoutData {
    payment: string;
    items: CheckoutItemData[];
    billingAddress: AddressData;
    shippingAddress: AddressData;
    comment: string;
}

export abstract class ShopApi {
    abstract getCategoryBySlug(slug: string, options?: GetCategoryBySlugOptions): Observable<ShopCategory>;

    abstract getCategories(options?: GetCategoriesOptions): Observable<ShopCategory[]>;

    abstract getBrands(options?: GetBrandsOptions): Observable<Brand[]>;

    abstract getProductsList(options?: GetProductsListOptions): Observable<ProductsList>;

    abstract getProductBySlug(slug: string): Observable<Product>;

    abstract getProductReviews(productId: number, options?: GetProductReviewsOptions): Observable<ReviewsList>;

    abstract addProductReview(productId: number, data: AddProductReviewData): Observable<Review>;

    abstract getProductAnalogs(productId: number): Observable<Product[]>;

    abstract getRelatedProducts(productId: number, limit: number): Observable<Product[]>;

    abstract getFeaturedProducts(categorySlug: string, limit: number): Observable<Product[]>;

    abstract getPopularProducts(categorySlug: string, limit: number): Observable<Product[]>;

    abstract getTopRatedProducts(categorySlug: string, limit: number): Observable<Product[]>;

    abstract getSpecialOffers(limit: number): Observable<Product[]>;

    abstract getLatestProducts(limit: number): Observable<Product[]>;

    abstract getSearchSuggestions(query: string, options?: GetSearchSuggestionsOptions): Observable<GetSearchSuggestionsResult>;

    abstract checkout(data: CheckoutData): Observable<Order>;
}
