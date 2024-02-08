import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ChartistModule } from 'ng-chartist';
// import { ChartsModule } from 'ng2-charts';
// import { CountToModule } from 'angular-count-to';
// import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { SharedModule } from '../../shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ECommerceComponent } from './e-commerce/e-commerce.component';

@NgModule({
  declarations: [ECommerceComponent],
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    NgbModule,
    // ChartistModule,
    // ChartsModule,
    // CountToModule,
    DashboardRoutingModule,
    // Ng2GoogleChartsModule,
    SharedModule
  ]
})
export class DashboardModule {}
