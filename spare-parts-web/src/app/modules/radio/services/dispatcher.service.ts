import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

let uniqueId = 0;

@Injectable()
export class DispatcherService {
    private readonly id: number;

    private valueState;

    private changeSubject$: Subject<any> = new Subject<any>();

    change$: Observable<any> = this.changeSubject$.asObservable();

    get name() {
        return `app-radio-button-${this.id}`;
    }

    get value(): any {
        return this.valueState;
    }
    set value(value: any) {
        if (value !== this.valueState) {
            this.valueState = value;
            this.changeSubject$.next(value);
        }
    }

    constructor() {
        this.id = ++uniqueId;
    }
}
