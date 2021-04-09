import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { VehicleApi } from '../../../../api/base';
import { Observable, Subject } from 'rxjs';
import { Vehicle } from '../../../../interfaces/vehicle';
import { map } from 'rxjs/operators';
import { UrlService } from '../../../../services/url.service';

@Component({
    selector: 'app-page-garage',
    templateUrl: './page-garage.component.html',
    styleUrls: ['./page-garage.component.scss'],
})
export class PageGarageComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    vehicles$: Observable<Vehicle[]>;

    hasVehicles$: Observable<boolean>;

    vehicle: FormControl = new FormControl(null);

    constructor(
        private vehiclesApi: VehicleApi,
        public url: UrlService,
    ) { }

    ngOnInit(): void {
        this.vehicles$ = this.vehiclesApi.userVehicles$;
        this.hasVehicles$ = this.vehicles$.pipe(map(x => x.length > 0));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
