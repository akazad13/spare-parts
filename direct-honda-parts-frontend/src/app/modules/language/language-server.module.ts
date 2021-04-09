import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { USER_LANGUAGES } from './interfaces/language';
import { serverLoaderFactory } from './services/server-loader.service';

export function userLanguagesFactory(): string[] {
    return [];
}

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forRoot({
            compiler: {
                provide: TranslateCompiler,
                useClass: TranslateMessageFormatCompiler,
            },
            loader: {
                provide: TranslateLoader,
                useFactory: serverLoaderFactory,
            },
        }),
    ],
    exports: [
        TranslateModule,
    ],
    providers: [
        {
            provide: USER_LANGUAGES,
            useFactory: userLanguagesFactory,
        },
    ],
})
export class LanguageServerModule { }
