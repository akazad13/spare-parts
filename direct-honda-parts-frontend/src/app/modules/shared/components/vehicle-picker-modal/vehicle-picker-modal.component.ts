import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import {
    VehiclePickerModalService,
    VehiclePickerModalSession,
} from '../../../../services/vehicle-picker-modal.service';
import { first, map, switchMap, takeUntil } from 'rxjs/operators';
import { Vehicle } from '../../../../interfaces/vehicle';
import { VehicleApi } from '../../../../api/base';
import { FormControl } from '@angular/forms';


@Component({
    selector: 'app-vehicle-picker-modal',
    templateUrl: './vehicle-picker-modal.component.html',
    styleUrls: ['./vehicle-picker-modal.component.scss'],
})
export class VehiclePickerModalComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroy$: Subject<void> = new Subject<void>();

    onSelectClick$: Subject<void> = new Subject<void>();

    session: VehiclePickerModalSession;

    vehicles$: Observable<Vehicle[]>;

    currentVehicleControl: FormControl = new FormControl(null);

    currentPanel: 'list' | 'form' = 'list';

    addVehicleControl: FormControl = new FormControl(null);

    @ViewChild('modal') modal: ModalDirective;

    constructor(
        private service: VehiclePickerModalService,
        private vehiclesApi: VehicleApi,
    ) { }

    ngOnInit(): void {
        this.vehicles$ = this.vehiclesApi.userVehicles$;

        this.onSelectClick$.pipe(
            switchMap(() => this.vehicles$.pipe(
                first(),
                map(vehicles => vehicles.find(x => x.id === this.currentVehicleControl.value) || null)),
            ),
        ).subscribe(vehicle => this.select(vehicle));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit(): void {
        this.service.show$.pipe(
            takeUntil(this.destroy$),
        ).subscribe(session => {
            this.session = session;
            this.modal.show();
            this.currentVehicleControl.setValue(session.currentVehicle?.id || null, {emitEvent: false});
        });

        this.modal.onHidden.pipe(
            takeUntil(this.destroy$),
        ).subscribe(() => {
            this.currentPanel = 'list';
        });
    }

    onVehicleAdded(vehicleId: number): void {
        this.currentPanel = 'list';
        this.currentVehicleControl.setValue(vehicleId, {emitEvent: false});
    }

    select(vehicle: Vehicle): void {
        if (this.session) {
            this.session.select$.emit(vehicle);
        }

        this.close();
    }

    close(): void {
        if (this.session) {
            this.session.select$.complete();
            this.session.close$.emit();
            this.session.close$.complete();
            this.session = null;
        }

        this.modal.hide();
    }
}
