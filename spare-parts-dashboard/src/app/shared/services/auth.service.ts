import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private jwtHelper: JwtHelperService) {}

  getCurrentUserId(): string {
    const decodedToken = this.getDecodedToken();
    if (decodedToken == null) {
      return decodedToken;
    }
    return decodedToken.Id;
  }

  getDecodedToken(): any {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user == null) {
      return user;
    }
    return this.jwtHelper.decodeToken(user.token);
  }

  loggedIn(): boolean {
    const user: any = localStorage.getItem('user');
    return !!user && !this.jwtHelper.isTokenExpired(user.token);
  }

  roleMatch(allowedRoles: string[]): boolean {
    let isMatch = false;
    const decodedToken = this.getDecodedToken();
    const userRoles = decodedToken.role as Array<string>;
    allowedRoles.forEach((element) => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }
}
