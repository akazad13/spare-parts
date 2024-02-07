import { Observable, of, throwError } from 'rxjs';
import { OrdersList } from '../../app/interfaces/list';
import { GetOrdersListOptions } from '../../app/api/base';
import { orders } from '../database/orders';
import { Order } from '../../app/interfaces/order';
import { HttpErrorResponse } from '@angular/common/http';

export function getOrdersList(options?: GetOrdersListOptions): Observable<OrdersList> {
    options = options || {};

    let items: Order[] = JSON.parse(JSON.stringify(orders));

    const page = options.page || 1;
    const limit = options.limit || 16;
    const sort = options.sort || 'default';
    const total = items.length;
    const pages = Math.ceil(items.length / limit);
    const from = (page - 1) * limit + 1;
    const to = page * limit;

    items = items.slice(from - 1, to);

    return of({
        page,
        limit,
        sort,
        total,
        pages,
        from,
        to,
        items,
    });
}

export function getOrderById(id: number): Observable<Order> {
    const order = orders.find(x => x.id === id);

    if (order) {
        return of(order);
    }

    return throwError(new HttpErrorResponse({status: 404, statusText: 'Page Not Found'}));
}

export function getOrderByToken(token: string): Observable<Order> {
    const order = orders.find(x => x.token === token);

    if (order) {
        return of(order);
    }

    return throwError(new HttpErrorResponse({status: 404, statusText: 'Page Not Found'}));
}
