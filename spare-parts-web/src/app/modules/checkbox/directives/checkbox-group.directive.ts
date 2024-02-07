import { Directive, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { CheckboxDispatcherService } from '../services/checkbox-dispatcher.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
    selector: '[appCheckboxGroup]',
    providers: [
        {
            provide: CheckboxDispatcherService,
            useClass: CheckboxDispatcherService,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxGroupDirective),
            multi: true,
        },
    ],
})
export class CheckboxGroupDirective
    implements OnInit, OnDestroy, ControlValueAccessor {
    private destroy$: Subject<void> = new Subject();

    changeFn: any = () => {};

    constructor(private dispatcher: CheckboxDispatcherService) {}

    ngOnInit(): void {
        this.dispatcher.change$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
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

    registerOnTouched(fn: any): void {}

    setDisabledState(isDisabled: boolean): void {}

    writeValue(value: any[]): void {
        this.dispatcher.value = value;
    }
}
