import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { mustMatchValidator } from '../../../../functions/validators/must-match';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AccountApi } from '../../../../api/base';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-password',
  templateUrl: './page-password.component.html',
  styleUrls: ['./page-password.component.scss']
})
export class PagePasswordComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  form: UntypedFormGroup;

  saveInProgress = false;
  successResponse = null;

  constructor(
    private account: AccountApi,
    private toastr: ToastrService,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: [mustMatchValidator('newPassword', 'confirmPassword')] }
    );
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

    this.account
      .updatePassword(
        this.form.value.currentPassword,
        this.form.value.newPassword
      )
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
