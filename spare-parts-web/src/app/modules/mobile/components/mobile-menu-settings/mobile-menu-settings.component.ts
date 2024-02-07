import { Component, HostBinding, OnInit } from '@angular/core';
import { MobileMenuService } from '../../../../services/mobile-menu.service';
import { CurrencyService } from '../../../currency/services/currency.service';
import { MobileMenuLink } from '../../../../interfaces/mobile-menu-link';
import { LanguageService } from '../../../language/services/language.service';

@Component({
    selector: 'app-mobile-menu-settings',
    templateUrl: './mobile-menu-settings.component.html',
    styleUrls: ['./mobile-menu-settings.component.scss'],
})
export class MobileMenuSettingsComponent implements OnInit {
    languages: MobileMenuLink[] = [];
    currencies: MobileMenuLink[] = [];

    @HostBinding('class.mobile-menu__settings-list') classMobileMenuSettingsList = true;

    constructor(
        public menu: MobileMenuService,
        public language: LanguageService,
        public currency: CurrencyService,
    ) { }

    ngOnInit(): void {
        this.languages = this.language.all.map(x => ({
            title: x.name,
            image: x.image,
            customFields: {
                code: x.code,
            },
        }));
        this.currencies = this.currency.all.map(x => ({
            title: `${x.symbol} ${x.name}`,
            customFields: {
                code: x.code,
            },
        }));
    }

    setLanguage(item: MobileMenuLink): void {
        this.language.set(item.customFields.code);
        this.menu.close();
    }

    setCurrency(item: MobileMenuLink): void {
        this.currency.set(item.customFields.code);
        this.menu.close();
    }
}
