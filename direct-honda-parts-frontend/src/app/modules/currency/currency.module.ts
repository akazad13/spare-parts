import { ModuleWithProviders, NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';

// pipes
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';

// services
import { CurrencyService } from './services/currency.service';

// other
import { CURRENCIES, CurrencyModuleConfig, DEFAULT_CURRENCY } from './interfaces/currency';


@NgModule({
    declarations: [
        // pipes
        CurrencyFormatPipe,
    ],
    exports: [
        // pipes
        CurrencyFormatPipe,
    ],
    imports: [
        // modules (angular)
        CommonModule,
    ],
})
export class CurrencyModule {
    static config(config: CurrencyModuleConfig): ModuleWithProviders<CurrencyModule> {
        return {
            ngModule: CurrencyModule,
            providers: [
                CurrencyService,
                {
                    provide: DEFAULT_CURRENCY,
                    useValue: config.default,
                },
                {
                    provide: CURRENCIES,
                    useValue: config.currencies,
                },
            ],
        };
    }
}
