import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IAccountApi } from '../../api/base';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    public router: Router,
    public toster: ToastrService,
    private account: IAccountApi,
    private authService: AuthService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Guard for user is login or not
    if (!this.authService.loggedIn()) {
      this.account.setUser(null);
      this.toster.error('You not authorized. Please login again.');
      this.router.navigate(['/auth/login']);
    }
    return true;
  }
}
