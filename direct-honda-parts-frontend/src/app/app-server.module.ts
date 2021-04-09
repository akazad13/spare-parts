import { NgModule } from '@angular/core';

// modules (angular)
import { ServerModule } from '@angular/platform-server';
// modules
import { AppModule } from './app.module';
import { LanguageServerModule } from './modules/language/language-server.module';

// components
import { AppComponent } from './app.component';


@NgModule({
    imports: [
        // modules (angular)
        ServerModule,
        // modules
        AppModule,
        LanguageServerModule,
    ],
    bootstrap: [AppComponent],
})
export class AppServerModule {}
