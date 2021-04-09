import { Component, HostBinding, Input } from '@angular/core';

export type BlockBrandsLayout = 'columns-8-full' | 'columns-7-sidebar';

@Component({
    selector: 'app-block-brands',
    templateUrl: './block-brands.component.html',
    styleUrls: ['./block-brands.component.scss'],
})
export class BlockBrandsComponent {
    @Input() layout: BlockBrandsLayout = 'columns-8-full';

    @Input() brands = [];

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-brands') classBlockBrands = true;

    @HostBinding('class.block-brands--layout--columns-8-full') get classBlockBrandsLayoutColumns8Full(): boolean {
        return this.layout === 'columns-8-full';
    }

    @HostBinding('class.block-brands--layout--columns-7-sidebar') get classBlockBrandsLayoutColumns7Sidebar(): boolean {
        return this.layout === 'columns-7-sidebar';
    }

    constructor() { }
}
