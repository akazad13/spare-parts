import { Injectable } from '@angular/core';
import { IAccountApi } from '../base';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../shared/model/User/user.model';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserProfile } from '../../shared/model/User/userProfile.model';

@Injectable()
export class AccountApi extends IAccountApi {
  private userSubject: BehaviorSubject<User | null>;
  baseUrl = environment.apiUrl;

  get user(): User | null {
    return this.userSubject.value;
  }

  readonly user$: Observable<User | null>;

  constructor(private http: HttpClient, private authService: AuthService) {
    super();

    const storedUser = localStorage.getItem('user');

    this.userSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.user$ = this.userSubject.asObservable();
  }

  signIn(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(this.baseUrl + 'account/login', {
        email,
        password
      })
      .pipe(tap((user) => this.setUser(user)));
  }

  signOut(): Observable<any> {
    return this.http.get(this.baseUrl + 'account/logout');
  }

  resetPassword(newPassword: string, resetToken: string): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + 'account/resetPasswordWithToken',
      { newPassword, resetToken }
    );
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'account/forgotPassword', {
      email
    });
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'account/updatePassword', {
      oldPassword,
      newPassword
    });
  }

  getProfile(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(
      this.baseUrl + `user/${this.authService.getCurrentUserId()}/profile`
    );
  }

  updateProfile(userProfile: UserProfile): Observable<any> {
    return this.http.patch<any>(
      this.baseUrl + `user/${this.authService.getCurrentUserId()}/profile`,
      userProfile
    );
  }

  updateTheme(theme: string): Observable<any> {
    return this.http.patch<any>(
      this.baseUrl + `user/${this.authService.getCurrentUserId()}/theme`,
      {
        theme
      }
    );
  }

  getUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(
      this.baseUrl +
        `admin/${this.authService.getCurrentUserId()}/users/-1/profile`
    );
  }

  updateUserProfile(userProfile: UserProfile, userId: number): Observable<any> {
    return this.http.patch<any>(
      this.baseUrl +
        `admin/${this.authService.getCurrentUserId()}/users/${userId}/profile`,
      userProfile
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(
      this.baseUrl +
        `admin/${this.authService.getCurrentUserId()}/users/${userId}/profile`
    );
  }

  addUser(userProfile: UserProfile): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + `admin/${this.authService.getCurrentUserId()}/users/new`,
      userProfile
    );
  }

  setUser(user: User): void {
    this.userSubject.next(user);

    localStorage.setItem('user', JSON.stringify(user));
  }
}
