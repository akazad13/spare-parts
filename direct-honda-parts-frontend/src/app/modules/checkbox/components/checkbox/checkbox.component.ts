import {
    Component,
    EventEmitter,
    forwardRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxDispatcherService } from '../../services/checkbox-dispatcher.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

let uniqueId = 0;

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    exportAs: 'appCheckbox',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true,
        },
    ],
})
export class CheckboxComponent implements OnInit, OnDestroy, ControlValueAccessor {
    private destroy$: Subject<void> = new Subject<void>();

    private readonly dataId: number;

    private stateChecked = false;

    @Input() disabled = false;

    @Input() value: any;

    @Input()
    set checked(value: boolean) {
        this.stateChecked = value;
    }
    get checked(): boolean {
        return this.stateChecked;
    }

    // tslint:disable-next-line:no-output-native
    @Output() readonly change: EventEmitter<CheckboxComponent> = new EventEmitter<CheckboxComponent>();

    @HostBinding('class.input-check') classInputCheck = true;

    get inputId(): string {
        return `app-checkbox-id-${this.dataId}`;
    }

    private changeFn: (_: boolean) => void = () => {};

    private touchedFn: () => void = () => {};

    constructor(
        @Optional() private dispatcher: CheckboxDispatcherService,
    ) {
        this.dataId = ++uniqueId;
    }

    ngOnInit(): void {
        if (this.dispatcher) {
            const checked2 = this.dispatcher.value.indexOf(this.value) !== -1;

            if (this.checked !== checked2) {
                this.checked = checked2;
                this.change.emit(this);
                this.changeFn(this.checked);
            }

            this.dispatcher.change$.pipe(
                takeUntil(this.destroy$),
            ).subscribe(value => {
                const checked = value.indexOf(this.value) !== -1;

                if (this.checked !== checked) {
                    this.checked = checked;
                    this.change.emit(this);
                    this.changeFn(this.checked);
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onInputChange(event: Event): void {
        event.stopPropagation();

        this.checked = (event.target as HTMLInputElement).checked;
        this.change.emit(this);
        this.changeFn(this.checked);

        if (this.dispatcher) {
            if (this.checked && this.dispatcher.value.indexOf(this.value) === -1) {
                this.dispatcher.value = [...this.dispatcher.value, this.value];
            } else if (!this.checked && this.dispatcher.value.indexOf(this.value) !== -1) {
                this.dispatcher.value = this.dispatcher.value.filter(x => x !== this.value);
            }
        }
    }

    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this.touchedFn = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(value: boolean): void {
        this.checked = !!value;
    }
}
