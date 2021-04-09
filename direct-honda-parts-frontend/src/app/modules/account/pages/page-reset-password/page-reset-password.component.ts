import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { mustMatchValidator } from '../../../../functions/validators/must-match';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountApi } from '../../../../api/base';

@Component({
  selector: 'app-page-reset-password',
  templateUrl: './page-reset-password.component.html',
  styleUrls: ['./page-reset-password.component.scss']
})
export class PageResetPasswordComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  resetToken: string;
  resetForm: FormGroup;
  resetInProgress = false;
  successResponse = null;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private account: AccountApi
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.resetToken = params.resetToken;
    });

    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: [mustMatchValidator('password', 'confirmPassword')] }
    );
  }

  reset(): void {
    this.resetForm.markAllAsTouched();

    if (this.resetInProgress || this.resetForm.invalid) {
      return;
    }

    this.resetInProgress = true;

    this.account
      .resetPassword(this.resetForm.value.password, this.resetToken)
      .pipe(
        finalize(() => (this.resetInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (response: any) => {
          this.successResponse = response.message;
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.resetForm.setErrors({
              server: error.error.message
            });
          } else {
            alert(error);
          }
        }
      );
  }
}
