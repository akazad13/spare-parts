import {
  Component,
  forwardRef,
  HostBinding,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormControl,
  UntypedFormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Vehicle } from '../../../../interfaces/vehicle';
import { VehicleApi } from '../../../../api/base';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

type ChangeFn = (_: Vehicle) => void;

type TouchedFn = () => void;

interface VehicleSelectItemDef<T = any> {
  key: string;
  label: string;
  placeholder: string;
  optionsSource: string;
}

interface VehicleSelectItem<T = any> extends VehicleSelectItemDef<T> {
  loading: boolean;
  options: T[];
  load: Subject<void>;
}

function makeItem<T>(itemDef: VehicleSelectItemDef<T>): VehicleSelectItem<T> {
  return { ...itemDef, loading: false, options: [], load: new Subject<void>() };
}

@Component({
  selector: 'app-vehicle-select',
  templateUrl: './vehicle-select.component.html',
  styleUrls: ['./vehicle-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VehicleSelectComponent),
      multi: true
    }
  ]
})
export class VehicleSelectComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  private destroy$: Subject<void> = new Subject<void>();

  value: Vehicle = null;

  form: UntypedFormGroup;

  items: VehicleSelectItem[] = [];

  @HostBinding('class.vehicle-select') classVehicleSelect = true;

  changeFn: ChangeFn = () => {};

  touchedFn: TouchedFn = () => {};

  constructor(private vehicleApi: VehicleApi) {}

  ngOnInit(): void {
    this.items = [
      makeItem({
        key: 'model',
        label: 'INPUT_VEHICLE_MODEL_LABEL',
        placeholder: 'INPUT_VEHICLE_MODEL_PLACEHOLDER',
        optionsSource: 'getModels'
      }),
      makeItem({
        key: 'year',
        label: 'INPUT_VEHICLE_YEAR_LABEL',
        placeholder: 'INPUT_VEHICLE_YEAR_PLACEHOLDER',
        optionsSource: 'getYears'
      }),
      makeItem({
        key: 'bodyAndtrim',
        label: 'INPUT_VEHICLE_BODY&TRIM_LABEL',
        placeholder: 'INPUT_VEHICLE_BODY&TRIM_PLACEHOLDER',
        optionsSource: 'getBodyAndtrim'
      }),
      makeItem({
        key: 'emissionAndTransmission',
        label: 'INPUT_VEHICLE_EMISSION&TRANSMISSION_LABEL',
        placeholder: 'INPUT_VEHICLE_EMISSION&TRANSMISSION_PLACEHOLDER',
        optionsSource: 'getEmissionAndTransmission'
      })
    ];

    const controls: { [key: string]: UntypedFormControl } = {};

    this.items.forEach((item, index) => {
      this.makeOptionsLoader(item, index)
        .pipe(takeUntil(this.destroy$))
        .subscribe((options) => (item.options = options));

      controls[item.key] = new UntypedFormControl('none');
      controls[item.key].valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.onItemValueChange(index));
    });

    this.form = new UntypedFormGroup(controls);

    this.onItemValueChange(0);
    this.items[0].load.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  registerOnChange(fn: ChangeFn): void {
    this.changeFn = fn;
  }

  registerOnTouched(fn: TouchedFn): void {
    this.touchedFn = fn;
  }

  writeValue(value: Vehicle): void {}

  private setValue(value: Vehicle): void {
    if (this.value !== value) {
      this.value = value;
      this.changeFn(value);
    }
  }

  private onItemValueChange(index: number): void {
    const control: AbstractControl = this.form.get(this.items[index].key);

    this.items.slice(index + 1).forEach((nextItem) => {
      nextItem.options = [];

      this.form.get(nextItem.key).setValue('none', { emitEvent: false });
      this.form.get(nextItem.key).disable({ emitEvent: false });
    });

    if (control.value === 'none') {
      this.setValue(null);
    } else {
      const nextItem = this.items.slice(index + 1, index + 2).pop();

      if (nextItem) {
        this.form.get(nextItem.key).enable({ emitEvent: false });

        nextItem.load.next();
      } else {
        this.setValue(control.value);
      }
    }
  }

  private getItemValue(item: VehicleSelectItem): string {
    const value: string = this.form.get(item.key).value;

    if (value !== 'none') {
      return value;
    }

    return value;
  }

  private getItemValues(items: VehicleSelectItem[]): string[] {
    return items.reduce(
      (acc, prevItem) => [...acc, this.getItemValue(prevItem)],
      []
    );
  }

  private makeOptionsLoader(
    item: VehicleSelectItem,
    index: number
  ): Observable<any[]> {
    return item.load.pipe(
      tap(() => (item.loading = true)),
      switchMap(() => {
        const args = this.getItemValues(this.items.slice(0, index));

        if (args.length > 0 && args.slice().pop() === 'none') {
          return of([]);
        }

        if (item.optionsSource === 'getModels') {
          return this.vehicleApi.getModels();
        } else if (item.optionsSource === 'getYears') {
          return this.vehicleApi.getYears(+args[0]);
        } else if (item.optionsSource === 'getBodyAndtrim') {
          return this.vehicleApi.getBodyAndTrims(+args[0], +args[1]);
        } else if (item.optionsSource === 'getEmissionAndTransmission') {
          const doorId = +args[2].split(',')[0];
          const gradeId = +args[2].split(',')[1];
          return this.vehicleApi.getEmissionAndTransmission(
            +args[0],
            +args[1],
            doorId,
            gradeId
          );
        }
      }),
      tap(() => (item.loading = false))
    );
  }
}
