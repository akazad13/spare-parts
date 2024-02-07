import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';

let uniqueId = 0;

export interface AddressFormValue {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postcode: number;
  email: string;
  phone: string;
  addressType: string;
}

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  private destroy$: Subject<void> = new Subject<void>();
  private readonly dataId: number = ++uniqueId;
  @Input() hasDefaultAddress: boolean;
  @Input() hasShippingAddress: boolean;
  @Input() hasOtherAddress: boolean;
  @Input() addressType: number;

  form: FormGroup;
  public pattern = new RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$');

  countries: string[] = ['USA'];

  get formId(): string {
    return `app-address-form-id-${this.dataId}`;
  }

  changeFn: (_: AddressFormValue) => void = () => {};

  touchedFn: () => void = () => {};

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      companyName: ['', Validators.maxLength(100)],
      country: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      postcode: [
        '',
        [Validators.required, Validators.min(0), Validators.max(1000000000)]
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)]
      ],
      phone: ['', [Validators.required, Validators.maxLength(50)]],
      addressType: ['']
    });
    this.form.valueChanges.subscribe((value) => {
      this.changeFn(value);
      this.touchedFn();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  writeValue(value: any): void {
    if (typeof value !== 'object') {
      value = {};
    }

    this.form.setValue(
      {
        firstName: '',
        lastName: '',
        companyName: '',
        country: 'USA',
        address: '',
        city: '',
        state: '',
        postcode: '',
        email: '',
        phone: '',
        addressType: '',
        ...value
      },
      { emitEvent: false }
    );
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid ? null : { addressForm: this.form.errors };
  }

  markAsTouched(): void {
    this.form.markAllAsTouched();
  }
}
