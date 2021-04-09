import {
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './services/cart.service';
import { CompareService } from './services/compare.service';
import { WishlistService } from './services/wishlist.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { filter, first, takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { VehicleApi } from './api/base';
import { CurrentVehicleService } from './services/current-vehicle.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
    private renderer: Renderer2,
    private router: Router,
    private zone: NgZone,
    private toastr: ToastrService,
    private cart: CartService,
    private compare: CompareService,
    private wishlist: WishlistService,
    private vehicleApi: VehicleApi,
    private currentVehicle: CurrentVehicleService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.router.events
          .pipe(
            filter((event) => event instanceof NavigationEnd),
            first()
          )
          .subscribe(() => {
            const preloader = document.querySelector('.site-preloader');

            preloader.addEventListener(
              'transitionend',
              (event: TransitionEvent) => {
                if (event.propertyName === 'opacity') {
                  preloader.remove();
                  document.querySelector('.site-preloader-style').remove();
                }
              }
            );
            preloader.classList.add('site-preloader__fade');
          });
      });
    }

    this.cart.onAdding$.subscribe((product) => {
      this.toastr.success(
        this.translate.instant('TEXT_TOAST_PRODUCT_ADDED_TO_CART', {
          productName: product.name,
        })
      );
    });
    this.compare.onAdding$.subscribe((product) => {
      this.toastr.success(
        this.translate.instant('TEXT_TOAST_PRODUCT_ADDED_TO_COMPARE', {
          productName: product.name,
        })
      );
    });
    this.wishlist.onAdding$.subscribe((product) => {
      this.toastr.success(
        this.translate.instant('TEXT_TOAST_PRODUCT_ADDED_TO_WISHLIST', {
          productName: product.name,
        })
      );
    });

    this.vehicleApi.currentVehicle$
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => (this.currentVehicle.value = x));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
