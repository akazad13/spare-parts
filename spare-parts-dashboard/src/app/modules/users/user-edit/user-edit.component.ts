import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserProfile } from '../../../shared/model/User/userProfile.model';
import { AccountApi } from 'src/app/api';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() userProfile: UserProfile;
  private destroy$: Subject<void> = new Subject<void>();
  countries: string[] = ['USA'];

  editProfileForm: UntypedFormGroup;
  updateInProgress = false;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private accountApi: AccountApi,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editProfileForm = this.fb.group({
      firstName: [this.userProfile.firstName, [Validators.required]],
      lastName: [this.userProfile.lastName, [Validators.required]],
      role: [this.userProfile.role, [Validators.required]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      phone: [this.userProfile.phone, [Validators.required]],
      active: [this.userProfile.active, [Validators.required]],
      companyName: [this.userProfile.companyName],
      address: [this.userProfile.address, [Validators.required]],
      city: [this.userProfile.city, [Validators.required]],
      state: [this.userProfile.state, [Validators.required]],
      postCode: [
        this.userProfile.postCode,
        [Validators.required, Validators.min(0), Validators.max(1000000000)]
      ],
      country: [this.userProfile.country, [Validators.required]]
    });
  }

  updateUser(): void {
    this.editProfileForm.markAllAsTouched();
    if (this.updateInProgress || this.editProfileForm.invalid) {
      return;
    }
    const userProfile: UserProfile = {
      ...this.editProfileForm.value
    };

    userProfile.active =
      this.editProfileForm.value.active.toString() === 'true';

    this.updateInProgress = true;

    this.accountApi
      .updateUserProfile(userProfile, this.userProfile.id)
      .pipe(
        finalize(() => (this.updateInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          Swal.fire('Updated!', 'User updated successfully.', 'success').then(
            (data) => {
              this.activeModal.close('reload');
            }
          );
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
