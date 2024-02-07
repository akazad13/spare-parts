import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CheckboxDispatcherService {
    private valueState: any[] = [];

    private changeSubject$: Subject<any[]> = new Subject<any[]>();

    change$: Observable<any[]> = this.changeSubject$.asObservable();

    get value(): any[] {
        return this.valueState;
    }
    set value(value: any[]) {
        if (value !== this.valueState) {
            this.changeSubject$.next(this.valueState = value);
        }
    }

    constructor() { }
}
