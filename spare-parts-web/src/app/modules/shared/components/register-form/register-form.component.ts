import { Component, forwardRef } from '@angular/core';
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
import { AddressFormValue } from '../address-form/address-form.component';
import { mustMatchValidator } from '../../../../functions/validators/must-match';

let uniqueId = 0;

@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RegisterFormComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RegisterFormComponent),
            multi: true,
        },
    ],
})
export class RegisterFormComponent implements ControlValueAccessor, Validator {
    private readonly dataId: number = ++uniqueId;

    form: FormGroup;

    get formId(): string {
        return `app-register-form-id-${this.dataId}`;
    }

    changeFn: (_: AddressFormValue) => void = () => {};

    touchedFn: () => void = () => {};

    constructor(
        private fb: FormBuilder,
    ) {
        this.form = this.fb.group({
            email:           ['', [Validators.required, Validators.email]],
            password:        ['', Validators.required],
            confirmPassword: ['', Validators.required],
        }, {validators: [mustMatchValidator('password', 'confirmPassword')]});

        this.form.valueChanges.subscribe(value => {
            this.changeFn(value);
            this.touchedFn();
        });
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

        this.form.setValue(
            {
                email: '',
                password: '',
                confirmPassword: '',
                ...value,
            },
            {emitEvent: false},
        );
    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.form.valid ? null : { registerForm: this.form.errors };
    }

    markAsTouched(): void {
        this.form.markAllAsTouched();
    }
}
