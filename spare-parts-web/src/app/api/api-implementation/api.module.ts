import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountApi, ShopApi, VehicleApi } from '../base';
import { AccountImplementationApi } from './account-implementation.api';
import { VehicleImplementationApi } from './vehicle-implementation.api';

@NgModule({
  imports: [CommonModule],
  providers: [
    { provide: AccountApi, useClass: AccountImplementationApi },
    { provide: VehicleApi, useClass: VehicleImplementationApi }
  ]
})
export class ApiModule {}
