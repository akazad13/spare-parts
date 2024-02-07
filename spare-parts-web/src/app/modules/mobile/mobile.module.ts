import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// modules (third-party)
import { TranslateModule } from '@ngx-translate/core';
// modules
import { SharedModule } from '../shared/shared.module';

// components
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { MobileMenuIndicatorsComponent } from './components/mobile-menu-indicators/mobile-menu-indicators.component';
import { MobileMenuLinksComponent } from './components/mobile-menu-links/mobile-menu-links.component';
import { MobileMenuPanelComponent } from './components/mobile-menu-panel/mobile-menu-panel.component';
import { MobileMenuSettingsComponent } from './components/mobile-menu-settings/mobile-menu-settings.component';
import { MobileLogoComponent } from './components/mobile-logo/mobile-logo.component';


@NgModule({
    declarations: [
        // components
        MobileHeaderComponent,
        MobileMenuComponent,
        MobileMenuIndicatorsComponent,
        MobileMenuLinksComponent,
        MobileMenuPanelComponent,
        MobileMenuSettingsComponent,
        MobileLogoComponent,
    ],
    exports: [
        // components
        MobileHeaderComponent,
        MobileMenuComponent,
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
export class MobileModule { }
