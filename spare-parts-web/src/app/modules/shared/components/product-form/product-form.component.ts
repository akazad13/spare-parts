import { Component, forwardRef, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductOption } from '../../../../interfaces/product';
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator,
    Validators,
} from '@angular/forms';
import { colorType } from '../../../../functions/color';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ProductFormComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ProductFormComponent),
            multi: true,
        },
    ],
})
export class ProductFormComponent implements OnChanges, ControlValueAccessor, Validator {
    form: FormGroup = this.fb.group({});

    @Input() options: ProductOption[] = [];

    @HostBinding('class.product-form') classProductForm = true;

    changeFn: (_: any) => void = () => {};

    touchedFn: () => void = () => {};

    constructor(
        private fb: FormBuilder,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            const controls = {};

            this.options.forEach(option => {
                controls[option.slug] = [null, [Validators.required]];
            });

            this.form = this.fb.group(controls);
            this.form.valueChanges.subscribe(value => {
                this.changeFn(value);
                this.touchedFn();
            });
        }
    }

    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this.touchedFn = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.form.disable({emitEvent: false});
        } else {
            this.form.enable({emitEvent: false});
        }
    }

    writeValue(value: any): void {
        if (typeof value !== 'object') {
            value = {};
        }

        const baseValue = {};

        this.options.forEach(option => baseValue[option.slug] = null);
        this.form.setValue({...baseValue, ...value}, {emitEvent: false});
    }

    validate(control: AbstractControl): ValidationErrors {
        return this.form.valid ? null : {options: this.form.errors};
    }

    isWhite(color: string): boolean {
        return colorType(color) === 'white';
    }
}
