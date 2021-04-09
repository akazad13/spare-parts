import { Directive, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { DispatcherService } from '../services/dispatcher.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appRadioGroup]',
    providers: [
        {
            provide: DispatcherService,
            useClass: DispatcherService,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RadioGroupDirective),
            multi: true,
        },
    ],
})
export class RadioGroupDirective implements OnInit, OnDestroy, ControlValueAccessor {
    private destroy$: Subject<void> = new Subject();

    private value: any;

    changeFn: any = () => {};

    constructor(
        private dispatcher: DispatcherService,
    ) { }

    ngOnInit(): void {
        this.dispatcher.change$.pipe(
            takeUntil(this.destroy$),
            filter(value => value !== this.value),
        ).subscribe(value => {
            this.value = value;
            this.changeFn(value);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    registerOnTouched(fn: any): void { }

    setDisabledState(isDisabled: boolean): void { }

    writeValue(value: any): void {
        this.value = value;
        this.dispatcher.value = value;
    }
}
