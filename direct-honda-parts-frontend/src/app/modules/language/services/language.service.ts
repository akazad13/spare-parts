import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { defer, merge, Observable, of } from 'rxjs';
import { Language, LanguageDirection, LANGUAGES } from '../interfaces/language';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class LanguageService {
    readonly current$: Observable<Language>;

    readonly currentChange$: Observable<Language>;

    readonly direction$: Observable<LanguageDirection>;

    readonly directionChange$: Observable<LanguageDirection>;

    get all(): Language[] { return this.languages; }

    get default(): Language {
        return this.languages.find(x => x.code === this.translate.defaultLang);
    }

    get current(): Language {
        return this.languages.find(x => x.code === this.translate.currentLang) || this.default;
    }

    constructor(
        private translate: TranslateService,
        private router: Router,
        @Inject(LANGUAGES) private languages: Language[],
        @Inject(PLATFORM_ID) private platformId: any,
    ) {
        this.currentChange$ = this.translate.onLangChange.pipe(
            map(event => this.languages.find(x => x.code === event.lang)),
        );
        this.current$ = merge(
            defer(() => of(this.current)),
            this.currentChange$,
        );

        this.directionChange$ = this.currentChange$.pipe(
            map(x => x.direction),
            distinctUntilChanged(),
        );
        this.direction$ = this.current$.pipe(
            map(x => x.direction),
            distinctUntilChanged(),
        );
    }

    init(defaultLang: string, userLangs: string[]): Promise<void> {
        this.translate.setDefaultLang(defaultLang);

        userLangs = userLangs || [];
        userLangs = userLangs.reduce((acc, code) => [...acc, code.split('-').shift()], userLangs);

        let storedLang;

        if (isPlatformBrowser(this.platformId)) {
            // ONLY_FOR_DEMO / START
            const {pathname, search} = document.location;
            const {lang} = this.router.parseUrl(pathname + search).queryParams;
            const urlLang = this.languages.map(x => x.code).find(x => x === lang);

            if (urlLang) {
                localStorage.setItem('language', urlLang);
            }
            // ONLY_FOR_DEMO / END

            storedLang = localStorage.getItem('language');
            storedLang = this.languages.map(x => x.code).find(x => x === storedLang);
        }

        let userLang;

        for (const code of userLangs) {
            userLang = this.languages.map(x => x.code).find(x => x === code);

            if (userLang) {
                break;
            }
        }

        return this.translate.use(storedLang || userLang || defaultLang).toPromise();
    }

    set(code: string): void {
        if (this.current.code === code) {
            return;
        }

        this.translate.use(code);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('language', code);
        }
    }

    isRTL(): boolean {
        return this.current.direction === 'rtl';
    }
}
