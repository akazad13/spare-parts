import { Product } from './product';
import { AddressData } from './address';


export interface OrderItemOption {
    name: string;
    value: string;
}

export interface OrderItem {
    product: Product;
    options: OrderItemOption[];
    price: number;
    quantity: number;
    total: number;
}

export interface OrderTotal {
    title: string;
    price: number;
}

export interface Order {
    id: number;
    token: string;
    number: string;
    createdAt: string;
    payment: string;
    status: string;
    items: OrderItem[];
    quantity: number;
    subtotal: number;
    totals: OrderTotal[];
    total: number;
    shippingAddress: AddressData;
    billingAddress: AddressData;
}
