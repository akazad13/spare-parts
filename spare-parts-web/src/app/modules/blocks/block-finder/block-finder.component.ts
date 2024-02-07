import { Component, HostBinding } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Vehicle } from '../../../interfaces/vehicle';
import { Router } from '@angular/router';
import { UrlService } from '../../../services/url.service';

@Component({
    selector: 'app-block-finder',
    templateUrl: './block-finder.component.html',
    styleUrls: ['./block-finder.component.scss'],
})
export class BlockFinderComponent {
    vehicleControl: UntypedFormControl = new UntypedFormControl(null);

    get vehicle(): Vehicle { return this.vehicleControl.value; }

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-finder') classBlockFinder = true;

    constructor(
        private router: Router,
        private url: UrlService,
    ) { }

    submit(): void {
        if (!this.vehicle) {
            return;
        }

        this.router.navigate([this.url.allProducts()], {
            queryParams: {
                filter_vehicle: this.vehicle.id,
            },
        }).then();
    }
}
