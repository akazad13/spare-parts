import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountApi } from '../../../api/base';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(
    private account: AccountApi,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const authGuardMode = next.data.authGuardMode || 'redirectToLogin';
    let pipe = (isAuth: any) => isAuth;

    if (authGuardMode === 'redirectToLogin') {
      pipe = map(
        (isAuth) => isAuth || this.router.createUrlTree(['account/login'])
      );
    } else if (authGuardMode === 'redirectToDashboard') {
      pipe = map(
        (isAuth) => !isAuth || this.router.createUrlTree(['account/dashboard'])
      );
    }

    const curUser = JSON.parse(localStorage.getItem('user'));

    if (curUser != null && this.jwtHelper.isTokenExpired(curUser.token)) {
      this.account.setUser(null);
    }

    return this.account.user$.pipe(
      map((user) => !!user),
      pipe
    );
  }
}
