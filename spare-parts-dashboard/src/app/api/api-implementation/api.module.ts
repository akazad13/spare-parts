import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IAccountApi } from '../base';
import { AccountApi } from './account.api';

@NgModule({
  imports: [CommonModule],
  providers: [{ provide: IAccountApi, useClass: AccountApi }]
})
export class ApiModule {}
