import { Observable } from 'rxjs';
import { User } from '../../shared/model/User/user.model';
import { UserProfile } from '../../shared/model/User/userProfile.model';

export abstract class IAccountApi {
  abstract user: User | null;

  abstract user$: Observable<User | null>;

  abstract signIn(email: string, password: string): Observable<User>;

  // abstract signUp(email: string, password: string): Observable<User>;

  abstract signOut(): Observable<void>;

  abstract resetPassword(
    newPassword: string,
    resetToken: string
  ): Observable<any>;

  abstract updatePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<any>;

  abstract forgetPassword(email: string): Observable<any>;

  abstract getProfile(): Observable<UserProfile[]>;
  abstract updateProfile(userProfile: UserProfile): Observable<any>;
  abstract updateTheme(theme: string): Observable<any>;

  abstract getUsers(): Observable<UserProfile[]>;
  abstract updateUserProfile(
    userProfile: UserProfile,
    userId: number
  ): Observable<any>;

  abstract deleteUser(userId: number): Observable<any>;

  abstract addUser(userProfile: UserProfile): Observable<any>;

  abstract setUser(user: User): void;
}
