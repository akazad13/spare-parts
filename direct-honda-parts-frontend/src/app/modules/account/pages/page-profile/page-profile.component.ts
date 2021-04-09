import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountApi } from '../../../../api/base';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.scss']
})
export class PageProfileComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  form: FormGroup;
  saveInProgress = false;
  user: User;
  successResponse = null;
  public pattern = new RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$');

  constructor(
    private account: AccountApi,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.account.user.firstName, [Validators.required]],
      lastName: [this.account.user.lastName, [Validators.required]],
      phone: [this.account.user.phone, [Validators.required]]
    });

    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.saveInProgress || this.form.invalid) {
      return;
    }

    this.saveInProgress = true;
    this.user.firstName = this.form.value.firstName;
    this.user.lastName = this.form.value.lastName;
    this.user.phone = this.form.value.phone;
    this.user.token = this.user.token;

    this.account.setUser(this.user);
    this.account
      .editProfile(this.form.value)
      .pipe(
        finalize(() => (this.saveInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (response: any) => {
          this.successResponse = response.message;
        },

        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastr.error('You are not authorized. Please login again.');
              this.account.setUser(null);
              this.router.navigateByUrl('/account/login').then();
            } else if (error.status === 403) {
              this.toastr.error('You are not authorized to perform this task.');
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
