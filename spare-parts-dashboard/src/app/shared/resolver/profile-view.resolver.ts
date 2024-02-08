import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { IAccountApi } from '../../api';
import { UserProfile } from '../model/User/userProfile.model';
@Injectable()
export class ProfileViewResolver {
  constructor(
    private account: IAccountApi,
    private router: Router,
    private toastr: ToastrService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<UserProfile[]> {
    return this.account.getProfile().pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.toastr.error('You are not authorized. Please login again.');
            this.account.setUser(null);
            this.router.navigateByUrl('/auth/login').then();
          } else if (error.status === 403) {
            this.toastr.error('You are not authorized to perform this task.');
          } else {
            this.toastr.error(error.error.message);
          }
        } else {
          this.toastr.error('Problem collecting the data');
        }
        this.router.navigate(['/dashboard']);
        return of(null);
      })
    );
  }
}
