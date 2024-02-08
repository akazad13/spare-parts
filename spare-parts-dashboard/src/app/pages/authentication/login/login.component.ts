import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AccountApi } from '../../../api/base';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  loginForm: UntypedFormGroup;
  loginInProgress = false;

  successResponse = null;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private account: AccountApi
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
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
        () => this.router.navigateByUrl('/dashboard'),
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.loginForm.setErrors({
              server: error.error.message
            });
          } else {
            this.loginForm.setErrors({
              server: error.message
            });
          }
        }
      );
  }
}
