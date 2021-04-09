import { NgModule } from '@angular/core';

// modules
import { AppModule } from './app.module';
import { LanguageBrowserModule } from './modules/language/language-browser.module';

// components
import { AppComponent } from './app.component';


@NgModule({
    imports: [
        AppModule,
        LanguageBrowserModule,
    ],
    bootstrap: [AppComponent],
})
export class AppBrowserModule {}
