import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { Address, AddressData } from '../../interfaces/address';
import { OrdersList } from '../../interfaces/list';
import { Order } from '../../interfaces/order';

export interface EditProfileData {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface GetOrdersListOptions {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface EditAddressData extends AddressData {
  default: boolean;
}

export abstract class AccountApi {
  abstract user: User | null;

  abstract user$: Observable<User | null>;

  abstract signIn(email: string, password: string): Observable<User>;

  abstract signUp(email: string, password: string): Observable<User>;

  abstract signOut(): Observable<void>;

  abstract editProfile(data: EditProfileData): Observable<any>;

  abstract resetPassword(
    newPassword: string,
    resetToken: string
  ): Observable<any>;

  abstract updatePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<any>;

  abstract forgetPassword(email: string): Observable<any>;

  abstract addorUpdateAddress(data: EditAddressData): Observable<any>;

  abstract delAddress(addressId: number): Observable<void>;

  abstract getDefaultAddress(): Observable<Address>;

  abstract getAddresswithId(id: number): Observable<Address | null>;

  abstract getAllAddresses(): Observable<Address[]>;

  abstract getOrdersList(
    options?: GetOrdersListOptions
  ): Observable<OrdersList>;

  abstract getOrderById(id: number): Observable<Order>;

  abstract getOrderByToken(token: string): Observable<Order>;
  abstract setUser(user: User): void;
}
