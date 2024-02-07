import { Component, ElementRef, forwardRef, HostBinding, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

function parseNumber<T>(value: any, def: T): number | T {
    if (typeof value === 'string') {
        value = parseFloat(value);
    } else if (typeof value !== 'number') {
        value = def;
    }

    return isNaN(value) ? def : value;
}

@Component({
    selector: 'app-input-number',
    templateUrl: './input-number.component.html',
    styleUrls: ['./input-number.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputNumberComponent),
            multi: true,
        },
    ],
})
export class InputNumberComponent implements ControlValueAccessor {
    options = {
        step: 1,
        min: null,
        max: null,
        disabled: false,
        readonly: false,
    };

    @HostBinding('class.input-number') classInputNumber = true;

    @Input() size: 'sm'|'lg' = null;

    @Input() set step(value: number) {
        this.options.step = parseNumber(value, 1);
    }

    @Input() set min(value: number) {
        this.options.min = parseNumber(value, null);
    }

    @Input() set max(value: number) {
        this.options.max = parseNumber(value, null);
    }

    @Input() set disabled(value: boolean) {
        this.options.disabled = !!value;
    }

    @Input() set readonly(value: boolean) {
        this.options.readonly = !!value;
    }

    @ViewChild('inputElement', { static: true }) inputElementRef: ElementRef;

    get inputElement(): HTMLInputElement {
        return this.inputElementRef.nativeElement;
    }

    get value(): '' | number {
        return this.inputElement.value === '' ? '' : parseFloat(this.inputElement.value);
    }
    set value(value: '' | number) {
        this.writeValue(value);
    }

    onChange = (_: any) => {};
    onTouched = () => {};

    constructor() { }

    add(): void {
        this.change(1);
        this.changeByTimer(1);
    }

    sub(): void {
        this.change(-1);
        this.changeByTimer(-1);
    }

    input(): void {
        this.onChange(this.value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: any): void {
        if (typeof obj === 'number') {
            this.inputElement.value = obj.toString();
        } else {
            this.inputElement.value = '';
        }
    }

    /**
     * @param direction - one of [-1, 1]
     */
    private change(direction: number): void {
        let value = (this.value === '' || isNaN(this.value) ? 0 : this.value) + this.options.step * direction;

        if (this.options.max !== null) {
            value = Math.min(this.options.max, value);
        }
        if (this.options.min !== null) {
            value = Math.max(this.options.min, value);
        }

        if (value !== this.value) {
            this.onChange(value);
            this.value = value;
        }
    }

    /**
     * @param direction - one of [-1, 1]
     */
    private changeByTimer(direction: number): void {
        let interval;
        const timer = setTimeout(() => {
            interval = setInterval(() => this.change(direction), 50);
        }, 300);

        const documentMouseUp = () => {
            clearTimeout(timer);
            clearInterval(interval);

            document.removeEventListener('mouseup', documentMouseUp, false);
        };

        document.addEventListener('mouseup', documentMouseUp, false);
    }
}
