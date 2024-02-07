import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CURRENCIES, Currency } from '../interfaces/currency';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { skip } from 'rxjs/operators';

@Injectable()
export class CurrencyService {
    private currentSubject$: BehaviorSubject<Currency> = new BehaviorSubject<Currency>(null);

    readonly changes$: Observable<Currency> = this.currentSubject$.pipe(skip(1));

    readonly all: ReadonlyArray<Currency> = [];

    get current(): Currency {
        return this.currentSubject$.value;
    }

    constructor(
        @Inject(CURRENCIES) currencies: Currency[],
        @Inject(PLATFORM_ID) private platformId: any,
    ) {
        this.all = currencies;
        this.currentSubject$.next(this.all[0]);
        this.load();
    }

    set(code: string): void {
        const newCurrency = this.all.find(x => x.code === code);

        if (newCurrency && newCurrency !== this.current) {
            this.currentSubject$.next(newCurrency);
            this.save();
        }
    }

    private save(): void {
        if (isPlatformBrowser(this.platformId) && this.current) {
            localStorage.setItem('currency', this.current.code);
        }
    }

    private load(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.set(localStorage.getItem('currency'));
        }
    }
}
