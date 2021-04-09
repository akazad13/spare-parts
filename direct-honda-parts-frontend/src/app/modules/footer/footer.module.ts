import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// modules (third-party)
import { TranslateModule } from '@ngx-translate/core';
// modules
import { SharedModule } from '../shared/shared.module';

// components
import { ContactsComponent } from './components/contacts/contacts.component';
import { FooterComponent } from './footer.component';
import { LinksComponent } from './components/links/links.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';

@NgModule({
    declarations: [
        // components
        ContactsComponent,
        FooterComponent,
        LinksComponent,
        NewsletterComponent,
    ],
    exports: [
        // components
        FooterComponent,
    ],
    imports: [
        // modules (angular)
        CommonModule,
        RouterModule,
        // modules (third-party)
        TranslateModule.forChild(),
        // modules
        SharedModule,
    ],
})
export class FooterModule { }
