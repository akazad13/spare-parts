import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
    exportAs: 'timer',
})
export class TimerComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    private reset$: Subject<void> = new Subject<void>();

    leftDays = 0;

    leftHours = 0;

    leftMinutes = 0;

    leftSeconds = 0;

    @Input() time = 0;

    @HostBinding('class.timer') classTimer = true;

    constructor() { }

    ngOnInit(): void {
        this.reset$.pipe(
            switchMap(() => timer(0, 1000)),
            takeUntil(this.destroy$),
            map(ticks => this.time - ticks),
            filter(left => left >= 0),
        ).subscribe(left => {
            this.leftDays = Math.floor(left / DAY);
            this.leftHours = Math.floor((left - this.leftDays * DAY) / HOUR);
            this.leftMinutes = Math.floor((left - this.leftDays * DAY - this.leftHours * HOUR) / MINUTE);
            this.leftSeconds = left - this.leftDays * DAY - this.leftHours * HOUR - this.leftMinutes * MINUTE;
        });

        this.reset$.next();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    format(value: number): string {
        return ('0' + value).substr(-2);
    }

    reset(): void {
        this.reset$.next();
    }
}
