import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AccountApi } from '../../../../api/base';

@Component({
  selector: 'app-page-forget-password',
  templateUrl: './page-forget-password.component.html',
  styleUrls: ['./page-forget-password.component.scss'],
})
export class PageForgetPasswordComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  baseUrl = environment.apiUrl;
  successResponse = null;
  resetInProgress = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private account: AccountApi
  ) {}
  form: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  send(): void {
    this.form.markAllAsTouched();
    if (this.resetInProgress || this.form.invalid) {
      return;
    }

    this.resetInProgress = true;

    this.account
      .forgetPassword(this.form.value.email)
      .pipe(
        finalize(() => (this.resetInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (response) => {
          this.successResponse = response.message;
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.form.setErrors({
              server: error.error.message,
            });
          }
        }
      );
  }
}
