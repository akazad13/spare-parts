import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ShopSidebarService {
    private isOpenState = false;

    private isOpenSubject: Subject<boolean> = new Subject();

    isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

    get isOpen(): boolean {
        return this.isOpenState;
    }

    set isOpen(value: boolean) {
        if (this.isOpenState !== value) {
            this.isOpenState = value;
            this.isOpenSubject.next(value);
        }
    }

    constructor() { }

    open(): void {
        this.isOpen = true;
    }

    close(): void {
        this.isOpen = false;
    }

    toggle(): void {
        this.isOpen = !this.isOpen;
    }
}
