import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountApi } from '../../../../api/base';
import { merge, of, Subject } from 'rxjs';
import { OrdersList } from '../../../../interfaces/list';
import { distinctUntilChanged, mergeMap, takeUntil } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { UrlService } from '../../../../services/url.service';

@Component({
  selector: 'app-page-orders',
  templateUrl: './page-orders.component.html',
  styleUrls: ['./page-orders.component.scss'],
})
export class PageOrdersComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  currentPage: UntypedFormControl = new UntypedFormControl(1);
  list: OrdersList;

  constructor(private accountApi: AccountApi, public url: UrlService) {}

  ngOnInit(): void {
    merge(of(this.currentPage.value), this.currentPage.valueChanges)
      .pipe(
        distinctUntilChanged(),
        mergeMap((page) =>
          this.accountApi.getOrdersList({
            limit: 5,
            page,
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((x) => (this.list = x));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
