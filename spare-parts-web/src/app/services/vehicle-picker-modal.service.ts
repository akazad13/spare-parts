import { EventEmitter, Injectable } from '@angular/core';
import { Vehicle } from '../interfaces/vehicle';

export class VehiclePickerModalSession {
    select$: EventEmitter<Vehicle> = new EventEmitter<Vehicle>();

    close$: EventEmitter<void> = new EventEmitter<void>();

    constructor(public currentVehicle: Vehicle) { }
}

@Injectable({
    providedIn: 'root',
})
export class VehiclePickerModalService {
    show$: EventEmitter<VehiclePickerModalSession> = new EventEmitter<VehiclePickerModalSession>();

    constructor() { }

    show(currentVehicle: Vehicle = null): VehiclePickerModalSession {
        const session = new VehiclePickerModalSession(currentVehicle);

        this.show$.emit(session);

        return session;
    }
}
