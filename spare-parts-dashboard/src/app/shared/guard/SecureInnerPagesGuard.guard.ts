import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountApi } from 'src/app/api';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SecureInnerPagesGuard implements CanActivate {
  constructor(
    private router: Router,
    public toster: ToastrService,
    private account: AccountApi,
    private authService: AuthService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const roles = next.firstChild.data.roles as Array<string>;

    if (roles) {
      const match = this.authService.roleMatch(roles);
      if (match) {
        return true;
      } else {
        this.router.navigate(['dashboard']);
        this.toster.error('You are not authorized to access this data');
      }
    }

    if (!this.authService.loggedIn()) {
      this.account.setUser(null);
      this.toster.error('You not authorized. Please login again.');
      this.router.navigate(['/auth/login']);
    }

    return true;
  }
}
