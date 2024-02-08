import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IAccountApi } from 'src/app/api';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { mustMatchValidator } from '../../../shared/functions/must-match';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.scss']
})
export class ResetPwdComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  resetToken: string;
  resetForm: UntypedFormGroup;
  resetInProgress = false;
  successResponse = null;
  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private account: IAccountApi
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
