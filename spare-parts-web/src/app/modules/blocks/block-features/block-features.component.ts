import { Component, HostBinding, Input } from '@angular/core';

export type BlockFeaturesLayout = 'top-strip' | 'bottom-strip';

@Component({
    selector: 'app-block-features',
    templateUrl: './block-features.component.html',
    styleUrls: ['./block-features.component.scss'],
})
export class BlockFeaturesComponent {
    @Input() layout: BlockFeaturesLayout = 'top-strip';

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-features') classBlockFeatures = true;

    @HostBinding('class.block-features--layout--top-strip') get classBlockFeaturesLayoutTopStrip(): boolean {
        return this.layout === 'top-strip';
    }

    @HostBinding('class.block-features--layout--bottom-strip') get classBlockFeaturesLayoutBottomStrip(): boolean {
        return this.layout === 'bottom-strip';
    }

    constructor() { }
}
