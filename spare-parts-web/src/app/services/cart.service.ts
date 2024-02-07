import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';

export interface CartItem {
    product: Product;
    options: {
        name: string;
        value: string;
    }[];
    quantity: number;
}

interface CartTotal {
    title: string;
    price: number;
    type: 'shipping'|'fee'|'tax'|'other';
}

interface CartData {
    items: CartItem[];
    quantity: number;
    subtotal: number;
    totals: CartTotal[];
    total: number;
}

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private data: CartData = {
        items: [],
        quantity: 0,
        subtotal: 0,
        totals: [],
        total: 0,
    };

    private itemsSubject$: BehaviorSubject<CartItem[]> = new BehaviorSubject(this.data.items);
    private quantitySubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.quantity);
    private subtotalSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.subtotal);
    private totalsSubject$: BehaviorSubject<CartTotal[]> = new BehaviorSubject(this.data.totals);
    private totalSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.total);
    private onAddingSubject$: Subject<Product> = new Subject();

    get items(): ReadonlyArray<CartItem> {
        return this.data.items;
    }

    get subtotal(): number {
        return this.data.subtotal;
    }

    get totals(): ReadonlyArray<CartTotal> {
        return this.data.totals;
    }

    get quantity(): number {
        return this.data.quantity;
    }

    get total(): number {
        return this.data.total;
    }

    readonly items$: Observable<CartItem[]> = this.itemsSubject$.asObservable();
    readonly quantity$: Observable<number> = this.quantitySubject$.asObservable();
    readonly subtotal$: Observable<number> = this.subtotalSubject$.asObservable();
    readonly totals$: Observable<CartTotal[]> = this.totalsSubject$.asObservable();
    readonly total$: Observable<number> = this.totalSubject$.asObservable();

    readonly onAdding$: Observable<Product> = this.onAddingSubject$.asObservable();

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.load();
            this.calc();
        }
    }

    add(product: Product, quantity: number, options: {name: string; value: string}[] = []): Observable<CartItem> {
        // timer only for demo
        return timer(350).pipe(map(() => {
            this.onAddingSubject$.next(product);

            let item = this.items.find(eachItem => {
                if (eachItem.product.id !== product.id || eachItem.options.length !== options.length) {
                    return false;
                }

                if (eachItem.options.length) {
                    for (const option of options) {
                        if (!eachItem.options.find(itemOption => itemOption.name === option.name && itemOption.value === option.value)) {
                            return false;
                        }
                    }
                }

                return true;
            });

            if (item) {
                item.quantity += quantity;
            } else {
                item = {product, quantity, options};

                this.data.items.push(item);
            }

            this.save();
            this.calc();

            return item;
        }));
    }

    update(updates: {item: CartItem, quantity: number}[]): Observable<void> {
        // timer only for demo
        return timer(350).pipe(map(() => {
            updates.forEach(update => {
                const item = this.items.find(eachItem => eachItem === update.item);

                if (item) {
                    item.quantity = update.quantity;
                }
            });

            this.save();
            this.calc();
        }));
    }

    remove(item: CartItem): Observable<void> {
        // timer only for demo
        return timer(350).pipe(map(() => {
            this.data.items = this.data.items.filter(eachItem => eachItem !== item);

            this.save();
            this.calc();
        }));
    }

    private calc(): void {
        let quantity = 0;
        let subtotal = 0;

        this.data.items.forEach(item => {
            quantity += item.quantity;
            subtotal += item.product.price * item.quantity;
        });

        const totals: CartTotal[] = [];

        totals.push({
            title: 'SHIPPING',
            price: 25,
            type: 'shipping',
        });
        totals.push({
            title: 'TAX',
            price: subtotal * 0.20,
            type: 'tax',
        });

        const total = subtotal + totals.reduce((acc, eachTotal) => acc + eachTotal.price, 0);

        this.data.quantity = quantity;
        this.data.subtotal = subtotal;
        this.data.totals = totals;
        this.data.total = total;

        this.itemsSubject$.next(this.data.items);
        this.quantitySubject$.next(this.data.quantity);
        this.subtotalSubject$.next(this.data.subtotal);
        this.totalsSubject$.next(this.data.totals);
        this.totalSubject$.next(this.data.total);
    }

    private save(): void {
        localStorage.setItem('cartItems', JSON.stringify(this.data.items));
    }

    private load(): void {
        const items = localStorage.getItem('cartItems');

        if (items) {
            this.data.items = JSON.parse(items);
        }
    }
}
