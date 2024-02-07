import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  filter,
  finalize,
  map,
  pairwise,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TermsModalComponent } from '../../../shared/components/terms-modal/terms-modal.component';
import { CartService } from '../../../../services/cart.service';
import { of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AddressFormComponent } from '../../../shared/components/address-form/address-form.component';
import { RegisterFormComponent } from '../../../shared/components/register-form/register-form.component';
import { TranslateService } from '@ngx-translate/core';
import { AccountApi, CheckoutData, ShopApi } from '../../../../api/base';
import { environment } from '../../../../../environments/environment';
import { AddressData } from '../../../../interfaces/address';
import { UrlService } from '../../../../services/url.service';

@Component({
  selector: 'app-page-checkout',
  templateUrl: './page-checkout.component.html',
  styleUrls: ['./page-checkout.component.scss']
})
export class PageCheckoutComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  private checkout$: Subject<CheckoutData> = new Subject<CheckoutData>();

  form: UntypedFormGroup;

  payPalConfig: IPayPalConfig;
  payPalInit = false;

  checkoutInProgress = false;

  payments = [
    {
      name: 'bank',
      label: 'TEXT_PAYMENT_BANK_LABEL',
      description: 'TEXT_PAYMENT_BANK_DESCRIPTION'
    },
    {
      name: 'check',
      label: 'TEXT_PAYMENT_CHECK_LABEL',
      description: 'TEXT_PAYMENT_CHECK_DESCRIPTION'
    },
    {
      name: 'cash',
      label: 'TEXT_PAYMENT_CASH_LABEL',
      description: 'TEXT_PAYMENT_CASH_DESCRIPTION'
    },
    {
      name: 'paypal',
      label: 'TEXT_PAYMENT_PAYPAL_LABEL',
      description: 'TEXT_PAYMENT_PAYPAL_DESCRIPTION'
    }
  ];

  @ViewChild('billingAddressForm', { read: AddressFormComponent })
  billingAddressForm: AddressFormComponent;

  @ViewChild('shippingAddressForm', { read: AddressFormComponent })
  shippingAddressForm: AddressFormComponent;

  @ViewChild('registerForm', { read: RegisterFormComponent })
  registerForm: RegisterFormComponent;

  enablePaypalButton = () => {};
  disablePaypalButton = () => {};

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private translate: TranslateService,
    private shopApi: ShopApi,
    private zone: NgZone,
    public url: UrlService,
    public accountApi: AccountApi,
    public cart: CartService
  ) {
    this.form = this.fb.group({
      billingAddress: [{}],

      createAccount: [false],
      account: [{}],

      shipToDifferentAddress: [false],
      shippingAddress: [{}],

      comments: [''],

      paymentMethod: ['bank'],

      agree: [false, [Validators.requiredTrue]]
    });

    this.form.get('account').disable({ emitEvent: false });
    this.form.get('shippingAddress').disable({ emitEvent: false });

    this.form.valueChanges
      .pipe(startWith(of(this.form.value)), pairwise())
      .subscribe(([oldValue, newValue]) => {
        if (
          oldValue.shipToDifferentAddress !== newValue.shipToDifferentAddress
        ) {
          this.toggleFormControl(
            'shippingAddress',
            newValue.shipToDifferentAddress
          );
        }
        if (oldValue.createAccount !== newValue.createAccount) {
          this.toggleFormControl('account', newValue.createAccount);
        }
        if (
          oldValue.paymentMethod !== newValue.paymentMethod &&
          newValue.paymentMethod === 'paypal'
        ) {
          this.payPalInit = false;
        }

        if (this.form.valid) {
          this.enablePaypalButton();
        } else {
          this.disablePaypalButton();
        }
      });
  }

  ngOnInit(): void {
    this.initConfig();

    this.cart.quantity$
      .pipe(
        filter((x) => x === 0),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.router.navigateByUrl('/shop/cart').then());

    this.checkout$
      .pipe(
        tap(() => (this.checkoutInProgress = true)),
        switchMap((checkoutData) => {
          const value = this.form.value;

          if (value.createAccount) {
            return this.accountApi
              .signUp(value.account.email, value.account.password)
              .pipe(map(() => checkoutData));
          }

          return of(checkoutData);
        }),
        switchMap((checkoutData) => this.shopApi.checkout(checkoutData)),
        tap(() => (this.checkoutInProgress = false)),
        finalize(() => (this.checkoutInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((order) => {
        this.router.navigateByUrl(`/shop/checkout/${order.token}`).then();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFormControl(controlName: string, isEnabled: boolean): void {
    if (isEnabled) {
      this.form.get(controlName).enable({ emitEvent: false });
    } else {
      this.form.get(controlName).disable({ emitEvent: false });
    }
  }

  showTerms(event: MouseEvent): void {
    event.preventDefault();

    this.modalService.show(TermsModalComponent, { class: 'modal-lg' });
  }

  createOrder(): void {
    if (!this.checkData()) {
      return;
    }

    this.checkout();
  }

  private markAllAsTouched(): void {
    this.form.markAllAsTouched();
    this.billingAddressForm.markAsTouched();
    this.shippingAddressForm.markAsTouched();
    this.registerForm.markAsTouched();
  }

  private checkData(): boolean {
    this.markAllAsTouched();

    if (this.form.invalid) {
      alert(this.translate.instant('ERROR_CHECKOUT'));
    }

    return this.form.valid;
  }

  private checkout(): void {
    const value = this.form.value;

    const billingAddress = value.billingAddress;
    const shippingAddress = value.shipToDifferentAddress
      ? value.shippingAddress
      : value.billingAddress;

    const checkoutData: CheckoutData = {
      payment: value.paymentMethod,
      items: this.cart.items.map((item) => ({
        productId: item.product.id,
        options: item.options,
        quantity: item.quantity
      })),
      billingAddress,
      shippingAddress,
      comment: value.comment
    };

    this.checkout$.next(checkoutData);
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.paypalClientId,
      createOrderOnClient: (): ICreateOrderRequest =>
        this.createPayPalOrderRequest(),
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'horizontal',
        tagline: false
      },
      onInit: (data, actions) => {
        this.payPalInit = true;
        this.enablePaypalButton = actions.enable;
        this.disablePaypalButton = actions.disable;

        if (this.form.invalid) {
          this.disablePaypalButton();
        }
      },
      onApprove: () => {},
      onClientAuthorization: () => {
        this.zone.run(() => this.checkout());
      },
      onError: (err) => {
        alert(err);
      },
      onClick: () => {
        this.zone.run(() => this.checkData());
      }
    };
  }

  private createPayPalOrderRequest(): ICreateOrderRequest {
    const value = this.form.value;

    const billingAddress: AddressData = value.billingAddress;
    const shippingAddress: AddressData = value.shipToDifferentAddress
      ? value.shippingAddress
      : value.billingAddress;

    const shipping = this.cart.totals
      .filter((x) => x.type === 'shipping')
      .reduce((acc, total) => acc + total.price, 0);
    const taxes = this.cart.totals
      .filter((x) => x.type === 'tax')
      .reduce((acc, total) => acc + total.price, 0);

    return {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: this.cart.total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.cart.subtotal.toFixed(2)
              },
              shipping: {
                currency_code: 'USD',
                value: shipping.toFixed(2)
              },
              tax_total: {
                currency_code: 'USD',
                value: taxes.toFixed(2)
              }
            }
          },
          items: this.cart.items.map((item) => ({
            category: 'PHYSICAL_GOODS',
            name: item.product.name,
            quantity: item.quantity.toString(),
            sku: item.product.sku,
            unit_amount: {
              currency_code: 'USD',
              value: item.product.price.toFixed(2)
            }
          })),
          shipping: {
            address: {
              country_code: shippingAddress.country,
              admin_area_1: shippingAddress.state,
              admin_area_2: shippingAddress.city,
              address_line_1: shippingAddress.address,
              postal_code: shippingAddress.postCode
            }
          }
        }
      ],
      payer: {
        address: {
          country_code: billingAddress.country,
          admin_area_1: billingAddress.state,
          admin_area_2: billingAddress.city,
          address_line_1: billingAddress.address,
          postal_code: billingAddress.postCode
        },
        name: {
          given_name: billingAddress.firstName,
          surname: billingAddress.lastName
        },
        email_address: billingAddress.email
      }
    };
  }
}
