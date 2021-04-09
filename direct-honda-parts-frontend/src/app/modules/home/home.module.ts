import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
// modules (third-party)
import { TranslateModule } from '@ngx-translate/core';
// modules
import { BlocksModule } from '../blocks/blocks.module';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';

// pages
import { HomepageComponent } from './pages/homepage/homepage.component';

@NgModule({
  declarations: [
    // pages
    HomepageComponent,
  ],
  imports: [
    // modules (angular)
    CommonModule,
    // modules (third-party)
    TranslateModule.forChild(),
    // modules
    BlocksModule,
    HomeRoutingModule,
    SharedModule,
  ],
})
export class HomeModule {}
