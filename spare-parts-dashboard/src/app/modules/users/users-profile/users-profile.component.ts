import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { UserViewComponent } from '../user-view/user-view.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserProfile } from '../../../shared/model/User/userProfile.model';
import { AccountApi } from '../../../api';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.scss']
})
export class UsersProfileComponent implements OnInit, OnDestroy {
  public url: any;
  usersProfile: UserProfile[];
  routeSubscription: Subscription;
  private destroy$: Subject<void> = new Subject<void>();
  deleteInProgress: boolean;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private accountApi: AccountApi,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.data.subscribe((data) => {
      const currentUserId = +this.authService.getCurrentUserId();
      this.usersProfile = data.usersProfile.filter(
        (user: UserProfile) => user.id !== currentUserId
      );
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  viewUserDetails(index: number): void {
    const modalRef = this.modalService.open(UserViewComponent, { size: 'lg' });
    modalRef.componentInstance.userProfile = this.usersProfile[index];
  }

  editUser(index: number): void {
    const modalRef = this.modalService.open(UserEditComponent, { size: 'lg' });
    modalRef.componentInstance.userProfile = this.usersProfile[index];
    modalRef.result.then((data) => {
      if (data === 'reload') {
        this.reloadComponent();
      }
    });
  }

  deleteUser(index: number): void {
    Swal.fire({
      titleText: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        this.deleteInProgress = true;
        this.accountApi
          .deleteUser(this.usersProfile[index].id)
          .pipe(
            finalize(() => (this.deleteInProgress = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            () => {
              Swal.fire(
                'Deleted!',
                'User deleted successfully.',
                'success'
              ).then((data) => {
                this.reloadComponent();
              });
            },
            (error) => {
              if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                  this.toastr.error(
                    'You are not authorized. Please login again.'
                  );
                  this.accountApi.setUser(null);
                  this.router.navigateByUrl('/auth/login').then();
                } else if (error.status === 403) {
                  this.toastr.error(
                    'You are not authorized to perform this task.'
                  );
                } else {
                  this.toastr.error(error.error.message);
                }
              } else {
                this.toastr.error(error);
              }
            }
          );
      }
    });
  }

  reloadComponent(): void {
    location.reload();
  }
}
