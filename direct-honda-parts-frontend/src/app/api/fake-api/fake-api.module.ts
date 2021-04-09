import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopApi } from '../base';
import { FakeShopApi } from './fake-shop.api';

@NgModule({
  imports: [CommonModule],
  providers: [{ provide: ShopApi, useClass: FakeShopApi }]
})
export class FakeApiModule {}
