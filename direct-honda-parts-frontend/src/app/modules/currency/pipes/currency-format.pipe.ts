import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CurrencyService } from '../services/currency.service';

@Pipe({
    name: 'currencyFormat',
    pure: false,
})
export class CurrencyFormatPipe implements PipeTransform {
    currencyPipe: CurrencyPipe = new CurrencyPipe(this.locale);

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private service: CurrencyService,
    ) { }

    transform(
        value: number,
        currencyCode?: string,
        display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
        digitsInfo?: string,
        locale?: string,
    ): string | null {
        const currency = (currencyCode && this.service.all.find(x => x.code === currencyCode)) || this.service.current;

        if (!currency) {
            return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
        }

        value = value * currency.rate;

        const formatFn = currency.formatFn || 'currency-pipe';
        const formatOptions = currency.formatOptions || {};

        if (formatFn === 'currency-pipe') {
            currencyCode = currencyCode || this.service.current.code;
            display = display || formatOptions.display;
            digitsInfo = digitsInfo || formatOptions.digitsInfo;
            locale = locale || formatOptions.locale;

            return this.currencyPipe.transform(value * this.service.current.rate, currencyCode, display, digitsInfo, locale);
        } else {
            return formatFn(value, currency);
        }
    }
}
