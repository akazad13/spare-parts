import { Injectable } from '@angular/core';
import {
  AccountApi,
  EditAddressData,
  EditProfileData,
  GetOrdersListOptions
} from '../base';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { tap } from 'rxjs/operators';
import { Address } from '../../interfaces/address';
import { OrdersList } from '../../interfaces/list';
import { Order } from '../../interfaces/order';
import {
  getOrderById,
  getOrderByToken,
  getOrdersList
} from '../../../fake-server/endpoints';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenService } from '../../services/token.service';

@Injectable()
export class AccountImplementationApi extends AccountApi {
  private userSubject: BehaviorSubject<User | null>;
  baseUrl = environment.apiUrl;

  get user(): User | null {
    return this.userSubject.value;
  }

  readonly user$: Observable<User | null>;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    super();

    const storedUser = localStorage.getItem('user');

    this.userSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.user$ = this.userSubject.asObservable();
  }

  signIn(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(this.baseUrl + 'customer/login', {
        email,
        password
      })
      .pipe(tap((user) => this.setUser(user)));
  }

  signUp(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'customer/register', {
      email,
      password
    });
  }

  signOut(): Observable<any> {
    return this.http.get(this.baseUrl + 'account/logout');
  }

  editProfile(data: EditProfileData): Observable<any> {
    return this.http.post<any>(
      this.baseUrl +
        `customer/${this.tokenService.getCurrentUserId()}/updateProfile`,
      data
    );
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

  addorUpdateAddress(data: EditAddressData): Observable<any> {
    return this.http.post<any>(
      this.baseUrl +
        `customer/${this.tokenService.getCurrentUserId()}/addOrUpdateAddress`,
      data
    );
  }

  delAddress(addressId: number): Observable<any> {
    return this.http.delete<any>(
      this.baseUrl +
        `customer/${this.tokenService.getCurrentUserId()}/address/${addressId}`
    );
  }

  getDefaultAddress(): Observable<Address | null> {
    return this.http.get<Address>(
      this.baseUrl +
        `customer/${this.tokenService.getCurrentUserId()}/address/-1/type/1`
    );
  }

  getAddresswithId(addressId: number): Observable<Address | null> {
    return this.http.get<Address>(
      this.baseUrl +
        `customer/${this.tokenService.getCurrentUserId()}/address/${addressId}/type/0`
    );
  }

  getAllAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(
      this.baseUrl +
        `customer/${this.tokenService.getCurrentUserId()}/address/-1/type/0`
    );
  }

  getOrdersList(options?: GetOrdersListOptions): Observable<OrdersList> {
    return getOrdersList(options);
  }

  getOrderById(id: number): Observable<Order> {
    return getOrderById(id);
  }

  getOrderByToken(token: string): Observable<Order> {
    return getOrderByToken(token);
  }

  setUser(user: User): void {
    this.userSubject.next(user);

    localStorage.setItem('user', JSON.stringify(user));
  }
}
