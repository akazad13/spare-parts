import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';

// services
import { LanguageService } from './services/language.service';

// other
import { DEFAULT_LANGUAGE, Language, LanguageModuleConfig, LANGUAGES, USER_LANGUAGES } from './interfaces/language';
import { MESSAGE_FORMAT_CONFIG, MessageFormatConfig } from 'ngx-translate-messageformat-compiler';


export function languageInitFactory(
    language: LanguageService,
    defaultLanguage: string,
    userLanguages: string[],
): () => Promise<void> {
    return () => language.init(defaultLanguage, userLanguages);
}

export function messageFormatConfigFactory(languages: Language[]): () => MessageFormatConfig {
    return () => ({
        locales: languages.map(x => x.code),
    });
}


@NgModule({
    imports: [
        // modules (angular)
        CommonModule,
    ],
})
export class LanguageModule {
    static config(config: LanguageModuleConfig): ModuleWithProviders<LanguageModule> {
        return {
            ngModule: LanguageModule,
            providers: [
                LanguageService,
                {
                    provide: DEFAULT_LANGUAGE,
                    useValue: config.default,
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: languageInitFactory,
                    deps: [LanguageService, DEFAULT_LANGUAGE, USER_LANGUAGES],
                    multi: true,
                },
                {
                    provide: LANGUAGES,
                    useValue: config.languages,
                },
                {
                    provide: MESSAGE_FORMAT_CONFIG,
                    useFactory: messageFormatConfigFactory,
                    deps: [LANGUAGES],
                },
            ],
        };
    }
}
