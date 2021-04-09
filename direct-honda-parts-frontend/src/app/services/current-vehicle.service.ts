import { Injectable, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Vehicle } from '../interfaces/vehicle';

@Injectable({
    providedIn: 'root',
})
export class CurrentVehicleService implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    readonly value$: BehaviorSubject<Vehicle> = new BehaviorSubject<Vehicle>(null);

    get value(): Vehicle {
        return this.value$.value;
    }
    set value(value: Vehicle) {
        this.value$.next(value);
    }

    constructor(
        @Optional() @SkipSelf() parent: CurrentVehicleService,
    ) {
        if (parent) {
            this.value = parent.value;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
