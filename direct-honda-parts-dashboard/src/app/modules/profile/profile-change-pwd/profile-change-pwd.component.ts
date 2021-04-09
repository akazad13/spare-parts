import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AccountApi } from 'src/app/api';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil, finalize } from 'rxjs/operators';
import { mustMatchValidator } from '../../../shared/functions/must-match';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-change-pwd',
  templateUrl: './profile-change-pwd.component.html',
  styleUrls: ['./profile-change-pwd.component.scss']
})
export class ProfileChangePwdComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  form: FormGroup;

  saveInProgress = false;
  constructor(
    private account: AccountApi,
    private toastr: ToastrService,
    private translate: TranslateService,
    private fb: FormBuilder,
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
        () => {
          Swal.fire(
            'Updated!',
            'Password updated successfully.',
            'success'
          ).then((data) => {
            this.router.navigateByUrl('/profile/view');
          });
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastr.error('You are not authorized. Please login again.');
              this.account.setUser(null);
              this.router.navigateByUrl('/auth/login').then();
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
