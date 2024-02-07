import { Observable, of } from 'rxjs';
import { Order, OrderItem, OrderTotal } from '../../app/interfaces/order';
import { CheckoutData } from '../../app/api/base';
import { delayResponse } from '../utils';
import { getNextOrderId, getNextOrderNumber, getOrderToken, orders } from '../database/orders';
import { Product } from '../../app/interfaces/product';
import { products } from '../database/products';

export function checkout(data: CheckoutData): Observable<Order> {
    const id = getNextOrderId();
    const items: OrderItem[] = data.items.map(x => {
        const product: Product = products.find(p => p.id === x.productId);

        return {
            product,
            options: x.options,
            price: product.price,
            quantity: x.quantity,
            total: product.price * x.quantity,
        };
    });
    const quantity = items.reduce((acc, x) => acc + x.quantity, 0);
    const subtotal = items.reduce((acc, x) => acc + x.total, 0);
    const totals: OrderTotal[] = [
        {
            title: 'SHIPPING',
            price: 25,
        },
        {
            title: 'TAX',
            price: subtotal * 0.20,
        },
    ];
    const total = subtotal + totals.reduce((acc, x) => acc + x.price, 0);

    const date = new Date();
    const pad = (v: number) => ('00' + v).substr(-2);
    const createdAt = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    const order: Order = {
        id,
        token: getOrderToken(id),
        number: getNextOrderNumber(),
        createdAt,
        payment: data.payment,
        status: 'PENDING',
        items,
        quantity,
        subtotal,
        totals,
        total,
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
    };

    orders.unshift(order);

    return delayResponse(of(order));
}
