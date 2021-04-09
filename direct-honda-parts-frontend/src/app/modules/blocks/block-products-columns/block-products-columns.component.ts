import { Component, HostBinding, Input } from '@angular/core';
import { Product } from '../../../interfaces/product';

export interface BlockProductsColumnsItem {
    title: string;
    products: Product[];
}

@Component({
    selector: 'app-block-products-columns',
    templateUrl: './block-products-columns.component.html',
    styleUrls: ['./block-products-columns.component.scss'],
})
export class BlockProductsColumnsComponent {
    @Input() columns: BlockProductsColumnsItem[] = [];

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-products-columns') classBlockProductsColumns = true;

    constructor() { }
}
