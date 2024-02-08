import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Subject } from 'rxjs';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IAccountApi } from 'src/app/api/base';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-forget-pwd',
  templateUrl: './forget-pwd.component.html',
  styleUrls: ['./forget-pwd.component.scss']
})
export class ForgetPwdComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  routeSubscription: Subscription;
  resetForm: UntypedFormGroup;
  successResponse = null;
  resetInProgress = false;

  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private account: IAccountApi
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  send(): void {
    this.resetForm.markAllAsTouched();
    if (this.resetInProgress || this.resetForm.invalid) {
      return;
    }

    this.resetInProgress = true;

    this.account
      .forgetPassword(this.resetForm.value.email)
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
            this.resetForm.setErrors({
              server: error.error.message
            });
          }
        }
      );
  }
}
