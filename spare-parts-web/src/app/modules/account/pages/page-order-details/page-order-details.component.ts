import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountApi } from '../../../../api/base';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { Order } from '../../../../interfaces/order';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-page-order-details',
  templateUrl: './page-order-details.component.html',
  styleUrls: ['./page-order-details.component.scss'],
})
export class PageOrderDetailsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  order: Order;

  get orderNumber(): string {
    return this.translate.instant('FORMAT_ORDER_NUMBER', {
      number: this.order?.number,
    });
  }

  constructor(
    private route: ActivatedRoute,
    private accountApi: AccountApi,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((x) =>
          x.id ? parseFloat(x.id) : this.route.snapshot.data.orderId
        ),
        mergeMap((orderId) => this.accountApi.getOrderById(orderId)),
        takeUntil(this.destroy$)
      )
      .subscribe((order) => (this.order = order));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
