import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil, finalize } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { AccountApi } from 'src/app/api';
import { UserProfile } from '../../../shared/model/User/userProfile.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  routeSubscription: Subscription;
  countries: string[] = ['USA'];

  saveInProgress = false;
  editProfileForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accountApi: AccountApi,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.data.subscribe((data) => {
      const userProfile: UserProfile = data.userProfile[0];

      this.editProfileForm = this.fb.group({
        firstName: [userProfile.firstName, [Validators.required]],
        lastName: [userProfile.lastName, [Validators.required]],
        role: [userProfile.role, [Validators.required]],
        email: [userProfile.email, [Validators.required, Validators.email]],
        phone: [userProfile.phone, [Validators.required]],
        active: [userProfile.active, [Validators.required]],
        companyName: [userProfile.companyName],
        address: [userProfile.address, [Validators.required]],
        city: [userProfile.city, [Validators.required]],
        state: [userProfile.state, [Validators.required]],
        postCode: [
          userProfile.postCode,
          [Validators.required, Validators.min(0), Validators.max(1000000000)]
        ],
        country: [userProfile.country, [Validators.required]]
      });
    });
  }

  save(): void {
    this.editProfileForm.markAllAsTouched();
    if (this.saveInProgress || this.editProfileForm.invalid) {
      return;
    }
    const userProfile: UserProfile = {
      ...this.editProfileForm.value
    };

    this.saveInProgress = true;

    this.accountApi
      .updateProfile(userProfile)
      .pipe(
        finalize(() => (this.saveInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          Swal.fire(
            'Updated!',
            'Profile updated successfully.',
            'success'
          ).then((data) => {
            this.router.navigateByUrl('/profile/view');
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
              this.editProfileForm.setErrors({
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
