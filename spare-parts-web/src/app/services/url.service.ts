import { Injectable } from '@angular/core';
import { Category, ShopCategory } from '../interfaces/category';
import { Address } from '../interfaces/address';
import { Order } from '../interfaces/order';
import { Product } from '../interfaces/product';
import { Brand } from '../interfaces/brand';

@Injectable({
    providedIn: 'root',
})
export class UrlService {
    constructor() { }

    home(): string {
        return '/';
    }

    shop(): string {
        return '/shop';
    }

    category(category: Category): string {
        if (category.type === 'shop') {
            return this.shopCategory(category);
        }

        return '/';
    }

    shopCategory(category: ShopCategory): string {
        return `/shop/category/${category.slug}` + (category.layout === 'products' ? '/products' : '');
    }

    allProducts(): string {
        return '/shop/category/products';
    }

    product(product: Product): string {
        return `/shop/products/${product.slug}`;
    }

    brand(brand: Brand): string {
        return '/';
    }

    address(address: Address): string {
        return `/account/addresses/${address.id}`;
    }

    order(order: Order): string {
        return `/account/orders/${order.id}`;
    }

    cart(): string {
        return '/shop/cart';
    }

    checkout(): string {
        return '/shop/checkout';
    }

    login(): string {
        return '/account/login';
    }

    contacts(): string {
        return '/site/contact-us-v1';
    }
}
