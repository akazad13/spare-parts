import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-block-space',
    templateUrl: './block-space.component.html',
    styleUrls: ['./block-space.component.scss'],
})
export class BlockSpaceComponent {
    @Input() layout;

    @HostBinding('class.block-space') classBlockSpace = true;

    @HostBinding('class.block-space--layout--after-header') get classBlockSpaceLayoutAfterHeader(): boolean {
        return this.layout === 'after-header';
    }

    @HostBinding('class.block-space--layout--before-footer') get classBlockSpaceLayoutBeforeFooter(): boolean {
        return this.layout === 'before-footer';
    }

    @HostBinding('class.block-space--layout--divider-xs') get classBlockSpaceLayoutDividerExtraSmall(): boolean {
        return this.layout === 'divider-xs';
    }

    @HostBinding('class.block-space--layout--divider-sm') get classBlockSpaceLayoutDividerSmall(): boolean {
        return this.layout === 'divider-sm';
    }

    @HostBinding('class.block-space--layout--divider-nl') get classBlockSpaceLayoutDividerNormal(): boolean {
        return this.layout === 'divider-nl';
    }

    @HostBinding('class.block-space--layout--divider-lg') get classBlockSpaceLayoutDividerLarge(): boolean {
        return this.layout === 'divider-lg';
    }

    @HostBinding('class.block-space--layout--divider-xl') get classBlockSpaceLayoutDividerExtraLarge(): boolean {
        return this.layout === 'divider-xl';
    }

    @HostBinding('class.block-space--layout--spaceship-ledge-height') get classBlockSpaceLayoutSpaceshipLedgeHeight(): boolean {
        return this.layout === 'spaceship-ledge-height';
    }

    constructor() { }
}
