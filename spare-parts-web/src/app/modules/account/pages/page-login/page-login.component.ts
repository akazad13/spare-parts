import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountApi } from '../../../../api/base';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { mustMatchValidator } from '../../../../functions/validators/must-match';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  loginForm: UntypedFormGroup;
  loginInProgress = false;

  registerForm: UntypedFormGroup;
  registerInProgress = false;
  successResponse = null;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private account: AccountApi
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false]
    });

    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: [mustMatchValidator('password', 'confirmPassword')] }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginInProgress || this.loginForm.invalid) {
      return;
    }

    this.loginInProgress = true;

    this.account
      .signIn(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(
        finalize(() => (this.loginInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => this.router.navigateByUrl('/account/dashboard'),
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.loginForm.setErrors({
              server: error.error.message
            });
          } else {
            alert(error);
          }
        }
      );
  }

  register(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerInProgress || this.registerForm.invalid) {
      return;
    }

    this.registerInProgress = true;

    this.account
      .signUp(this.registerForm.value.email, this.registerForm.value.password)
      .pipe(
        finalize(() => (this.registerInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (response: any) => {
          this.successResponse = response.message;
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.registerForm.setErrors({
              server: error.error.message
            });
          } else {
            alert(error);
          }
        }
      );
  }
}
