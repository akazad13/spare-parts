import { Component, HostBinding, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { DispatcherService } from '../../services/dispatcher.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-radio-button',
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject();

    state = {
        checked: false,
        disabled: false,
    };

    @HostBinding('class.input-radio') classInputRadio = true;

    @Input() value: any;

    @Input() disabled = false;

    name: string;

    constructor(
        @Optional() public dispatcher: DispatcherService,
    ) { }

    ngOnInit(): void {
        if (this.dispatcher) {
            this.name = this.dispatcher.name;
            this.state.checked = this.value !== undefined && this.value === this.dispatcher.value;
            this.dispatcher.change$.pipe(takeUntil(this.destroy$)).subscribe(newValue => {
                this.state.checked = this.value === newValue;
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onChange() {
        if (this.dispatcher) {
            this.dispatcher.value = this.value;
        }
    }
}
