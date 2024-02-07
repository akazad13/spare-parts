import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// modules (third-party)
import { TranslateModule } from '@ngx-translate/core';
// modules
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';

// components
import { LayoutComponent } from './components/layout/layout.component';

// pages
import { PageAddressesComponent } from './pages/page-addresses/page-addresses.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';
import { PageEditAddressComponent } from './pages/page-edit-address/page-edit-address.component';
import { PageGarageComponent } from './pages/page-garage/page-garage.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageOrderDetailsComponent } from './pages/page-order-details/page-order-details.component';
import { PageOrdersComponent } from './pages/page-orders/page-orders.component';
import { PagePasswordComponent } from './pages/page-password/page-password.component';
import { PageProfileComponent } from './pages/page-profile/page-profile.component';
import { PageForgetPasswordComponent } from './pages/page-forget-password/page-forget-password.component';
import { PageResetPasswordComponent } from './pages/page-reset-password/page-reset-password.component';

@NgModule({
  declarations: [
    // components
    LayoutComponent,
    // pages
    PageAddressesComponent,
    PageDashboardComponent,
    PageEditAddressComponent,
    PageGarageComponent,
    PageLoginComponent,
    PageOrderDetailsComponent,
    PageOrdersComponent,
    PagePasswordComponent,
    PageProfileComponent,
    PageForgetPasswordComponent,
    PageResetPasswordComponent
  ],
  imports: [
    // modules (angular)
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // modules (third-party)
    TranslateModule.forChild(),
    // modules
    AccountRoutingModule,
    SharedModule
  ]
})
export class AccountModule {}
