import { Directive, OnDestroy } from '@angular/core';
import { Vehicle } from '../../../interfaces/vehicle';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VehicleApi } from '../../../api/base';


@Directive({
    selector: '[appRemoveVehicle]',
    exportAs: 'removeVehicle',
})
export class RemoveVehicleDirective implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    inProgress = false;

    constructor(
        private vehicleApi: VehicleApi,
    ) { }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    remove(vehicle: Vehicle): void {
        if (this.inProgress) {
            return;
        }

        this.inProgress = true;
        this.vehicleApi.removeUserVehicle(vehicle.id).pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            complete: () => this.inProgress = false,
        });
    }
}
