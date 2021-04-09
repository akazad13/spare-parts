import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountApi } from '../base';
import { AccountImplementationApi } from './account-implementation.api';

@NgModule({
  imports: [CommonModule],
  providers: [{ provide: AccountApi, useClass: AccountImplementationApi }]
})
export class ApiModule {}
