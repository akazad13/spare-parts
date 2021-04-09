import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import Swal from 'sweetalert2';
import { UserProfile } from '../../../shared/model/User/userProfile.model';
import { AccountApi } from 'src/app/api';
import { finalize, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  userProfile: UserProfile;

  registerForm: FormGroup;
  registerInProgress = false;
  countries: string[] = ['USA'];

  constructor(
    private fb: FormBuilder,
    private accountApi: AccountApi,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['0', [Validators.required]],
      phone: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postCode: [
        '',
        [Validators.required, Validators.min(0), Validators.max(1000000000)]
      ],
      country: ['USA', [Validators.required]]
    });
  }

  addUser(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerInProgress || this.registerForm.invalid) {
      return;
    }
    const userProfile: UserProfile = {
      ...this.registerForm.value
    };

    if (userProfile.role === '0') {
      Swal.fire('Error!', 'Please select a role.', 'warning');
      return;
    }

    userProfile.active = true;

    this.registerInProgress = true;

    this.accountApi
      .addUser(userProfile)
      .pipe(
        finalize(() => (this.registerInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (msg) => {
          Swal.fire(
            'Added!',
            'User Added successfully. ' + msg.message,
            'success'
          ).then((data) => {
            this.router.navigateByUrl('/users/view');
          });
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastr.error('You are not authorized. Please login again.');
              this.accountApi.setUser(null);
              this.router.navigateByUrl('/auth/login').then();
            } else if (error.status === 403) {
              this.toastr.error('You are not authorized to perform this task.');
            } else {
              this.registerForm.setErrors({
                server: error.error.message
              });
            }
          } else {
            this.toastr.error(error);
          }
        }
      );
  }
}
