import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

export function browserLoaderFactory(http: HttpClient, platformLocation: PlatformLocation): BrowserLoaderService {
    return new BrowserLoaderService(http, platformLocation);
}

@Injectable()
export class BrowserLoaderService implements TranslateLoader {
    constructor(
        private http: HttpClient,
        private platformLocation: PlatformLocation,
    ) { }

    getTranslation(lang: string): Observable<object> {
        return this.http.get(`${this.platformLocation.getBaseHrefFromDOM()}assets/i18n/${lang}.json`);
    }
}
