import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountApi } from '../../../../api/base';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  navigation = [];

  constructor(
    private account: AccountApi,
    private translate: TranslateService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initNavigation();
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.initNavigation());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.account
      .signOut()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.account.setUser(null);
          this.router.navigateByUrl('/account/login');
          this.toastr.success(response.message);
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastr.error('You are not authorized. Please login again.');
              this.account.setUser(null);
              this.router.navigateByUrl('/account/login');
            } else if (error.status === 403) {
              this.toastr.error('You are not authorized to perform this task.');
            } else {
              this.toastr.error(error.error.message);
            }
          } else {
            this.toastr.error(error);
          }
        }
      );
  }

  private initNavigation(): void {
    this.navigation = [
      {
        type: 'link',
        label: this.translate.instant('LINK_ACCOUNT_DASHBOARD'),
        url: '/account/dashboard'
      },
      {
        type: 'link',
        label: this.translate.instant('LINK_ACCOUNT_GARAGE'),
        url: '/account/garage'
      },
      {
        type: 'link',
        label: this.translate.instant('LINK_ACCOUNT_PROFILE'),
        url: '/account/profile'
      },
      {
        type: 'link',
        label: this.translate.instant('LINK_ACCOUNT_ORDERS'),
        url: '/account/orders'
      },
      {
        type: 'link',
        label: this.translate.instant('LINK_ACCOUNT_ADDRESSES'),
        url: '/account/addresses'
      },
      {
        type: 'link',
        label: this.translate.instant('LINK_ACCOUNT_PASSWORD'),
        url: '/account/password'
      }
    ];
  }
}
