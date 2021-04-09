export interface OrderItemOptionDef {
    name: string;
    value: string;
}

export interface OrderItemDef {
    product: string;
    options: OrderItemOptionDef[];
    quantity: number;
}

export interface OrderDef {
    number: string;
    createdAt: string;
    payment: string;
    status: string;
    items: OrderItemDef[];
}
