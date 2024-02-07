import {
  Component,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  UntypedFormBuilder,
  UntypedFormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { merge, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  finalize,
  map,
  mergeMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { Vehicle, VehiclesSearchDDL } from '../../../../interfaces/vehicle';
import { VehicleApi } from '../../../../api/base';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VehicleFormComponent),
      multi: true
    }
  ]
})
export class VehicleFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  private destroy$: Subject<void> = new Subject<void>();

  value: Vehicle = null;

  form: UntypedFormGroup;

  years: VehiclesSearchDDL[] = [];
  bodyAndTrims: VehiclesSearchDDL[] = [];
  models: VehiclesSearchDDL[] = [];
  vehicles: Vehicle[] = [];

  loading = {
    years: false,
    bodyAndTrims: false,
    models: false,
    vehicles: false,
    vin: false
  };

  errors = {
    vin: false
  };

  vehicleByFilters: Vehicle = null;
  vehicleByVin: Vehicle = null;

  @Input() location: 'search' | 'account' | 'modal' = 'search';

  @HostBinding('class.vehicle-form') classVehicleForm = true;

  @HostBinding('class.vehicle-form--layout--search')
  get classVehicleFormLocationSearch(): boolean {
    return this.location === 'search';
  }

  @HostBinding('class.vehicle-form--layout--account')
  get classVehicleFormLocationAccount(): boolean {
    return this.location === 'account';
  }

  @HostBinding('class.vehicle-form--layout--modal')
  get classVehicleFormLocationModal(): boolean {
    return this.location === 'modal';
  }

  changeFn: (_: Vehicle) => void = () => {};

  touchedFn: () => void = () => {};

  constructor(private fb: UntypedFormBuilder, private vehicleService: VehicleApi) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      year: [],
      make: [],
      model: [],
      engine: [],
      vin: ['']
    });

    this.form.controls.year.valueChanges.subscribe((value) => {
      this.form.controls.make.setValue('none', { onlySelf: true });

      if (value !== 'none') {
        this.loadMakes();
      }
    });
    this.form.controls.make.valueChanges.subscribe((value) => {
      this.form.controls.model.setValue('none', { onlySelf: true });

      if (value !== 'none') {
        this.loadModels();
      }
    });
    this.form.controls.model.valueChanges.subscribe((value) => {
      this.form.controls.engine.setValue('none', { onlySelf: true });

      if (value !== 'none') {
        this.loadEngines();
      }
    });
    this.form.controls.engine.valueChanges.subscribe((value) => {
      if (value !== 'none') {
        this.vehicleByFilters = this.vehicles.find((x) => x.engine === value);
      } else {
        this.vehicleByFilters = null;
      }

      this.updateValue();
    });

    this.form.valueChanges.subscribe((value) => {
      if (value.year && value.year !== 'none') {
        this.form.controls.make.enable({ emitEvent: false });
      } else {
        this.form.controls.make.disable({ emitEvent: false });
      }

      if (value.make && value.make !== 'none') {
        this.form.controls.model.enable({ emitEvent: false });
      } else {
        this.form.controls.model.disable({ emitEvent: false });
      }

      if (value.model && value.model !== 'none') {
        this.form.controls.engine.enable({ emitEvent: false });
      } else {
        this.form.controls.engine.disable({ emitEvent: false });
      }
    });

    this.form.setValue({
      year: 'none',
      make: 'none',
      model: 'none',
      engine: 'none',
      vin: ''
    });

    this.loadYears();

    this.form.controls.vin.valueChanges
      .pipe(
        map((value) => value.trim()),
        tap((value) => {
          this.loading.vin = value !== '';

          if (value === '') {
            this.vehicleByVin = null;
            this.errors.vin = false;

            this.updateValue();
          }
        }),
        debounceTime(500),
        filter((value) => value !== ''),
        mergeMap((value) =>
          this.vehicleService.getVehicleByVin(value).pipe(
            catchError((error) => of(error)),
            // finalize(() => {
            //     if (this.form.controls.vin.value.trim() === value) {
            //         this.loading.vin = false;
            //     }
            // }),
            // Abort vehicle search when component is destroyed or VIN is changed.
            takeUntil(merge(this.destroy$, this.form.controls.vin.valueChanges))
          )
        )
      )
      .subscribe((value) => {
        this.loading.vin = false;

        if (value instanceof HttpErrorResponse) {
          this.vehicleByVin = null;
          this.errors.vin = true;
        } else {
          this.vehicleByVin = value;
          this.errors.vin = false;
        }

        this.updateValue();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadYears(): void {
    this.loading.years = true;

    this.vehicleService
      .getYears(10)
      .pipe(
        finalize(() => (this.loading.years = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((years) => (this.years = years));
  }

  loadMakes(): void {
    this.loading.bodyAndTrims = true;

    const year = parseFloat(this.form.controls.year.value);

    this.vehicleService
      .getBodyAndTrims(10, year)
      .pipe(
        finalize(() => (this.loading.bodyAndTrims = false)),
        takeUntil(merge(this.destroy$, this.form.controls.year.valueChanges))
      )
      .subscribe((bodyAndTrims) => (this.bodyAndTrims = bodyAndTrims));
  }

  loadModels(): void {
    this.loading.models = true;

    const year = parseFloat(this.form.controls.year.value);
    const make = this.form.controls.make.value;
    this.vehicleService
      .getModels()
      .pipe(
        finalize(() => (this.loading.models = false)),
        takeUntil(merge(this.destroy$, this.form.controls.make.valueChanges))
      )
      .subscribe((models) => (this.models = models));
  }

  loadEngines(): void {
    this.loading.vehicles = true;

    const year = parseFloat(this.form.controls.year.value);
    const make = this.form.controls.make.value;
    const model = this.form.controls.model.value;

    this.vehicleService
      .getVehicles(year, make, model)
      .pipe(
        finalize(() => (this.loading.vehicles = false)),
        takeUntil(merge(this.destroy$, this.form.controls.model.valueChanges))
      )
      .subscribe((vehicles) => (this.vehicles = vehicles));
  }

  registerOnChange(fn: any): void {
    this.changeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  writeValue(value: any): void {}

  updateValue(): void {
    const value = this.vehicleByVin || this.vehicleByFilters;

    if (value !== this.value) {
      this.value = value;

      this.changeFn(value);
      this.touchedFn();
    }
  }
}
