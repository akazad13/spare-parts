import {
  Component,
  EventEmitter,
  HostBinding,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountApi } from '../../../../api/base';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  isAuth$: Observable<boolean>;
  firstName$: Observable<string>;
  lastName$: Observable<string>;
  email$: Observable<string>;
  avatar$: Observable<string>;

  form: UntypedFormGroup;

  loginInProgress = false;

  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('class.account-menu') classAccountMenu = true;

  constructor(
    private fb: UntypedFormBuilder,
    public account: AccountApi,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.isAuth$ = this.account.user$.pipe(map((x) => x !== null));
    this.firstName$ = this.account.user$.pipe(
      map((x) => (x ? x.firstName : null))
    );
    this.lastName$ = this.account.user$.pipe(
      map((x) => (x ? x.lastName : null))
    );
    this.email$ = this.account.user$.pipe(map((x) => (x ? x.email : null)));
    this.avatar$ = this.account.user$.pipe(map((x) => (x ? x.avatar : null)));
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.form.markAllAsTouched();

    if (this.loginInProgress || this.form.invalid) {
      return;
    }

    this.loginInProgress = true;

    this.account
      .signIn(this.form.value.email, this.form.value.password)
      .pipe(
        finalize(() => (this.loginInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          // this.router.navigateByUrl('/account/dashboard').then();
          this.closeMenu.emit();
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.form.setErrors({
              server: error.error.message
            });
          } else {
            alert(error);
          }
        }
      );
  }

  logout(): void {
    this.account.signOut().subscribe(
      () => {
        this.closeMenu.emit();
        this.account.setUser(null);
        // this.router.navigateByUrl('/account/login').then();
        this.toastr.success('Logged out Successfully.');
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.toastr.error('You are not authorized. Please login again.');
            this.account.setUser(null);
            this.router.navigateByUrl('/account/login').then();
          } else {
            this.form.setErrors({
              server: error.error.message
            });
          }
        } else {
          alert(error);
        }
      }
    );
  }
}
