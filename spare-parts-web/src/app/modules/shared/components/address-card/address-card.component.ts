import { Component, HostBinding, Input, TemplateRef } from '@angular/core';
import { AddressData } from '../../../../interfaces/address';

@Component({
    selector: 'app-address-card',
    templateUrl: './address-card.component.html',
    styleUrls: ['./address-card.component.scss'],
})
export class AddressCardComponent {
    @Input() address: AddressData;

    @Input() label: string;

    @Input() featured = false;

    @Input() footer: TemplateRef<any>;

    @Input() loading = false;

    @HostBinding('class.card') classCard = true;

    @HostBinding('class.card--loading') get classCardLoading(): boolean { return this.loading; }

    @HostBinding('class.address-card') classAddressCard = true;

    @HostBinding('class.address-card--featured') get classAddressCardFeatured(): boolean { return this.featured; }

    constructor() { }
}
