import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    NgZone,
    OnDestroy, OnInit,
    PLATFORM_ID,
    ViewChild,
} from '@angular/core';
import { MobileMenuService } from '../../../../services/mobile-menu.service';
import { VehiclePickerModalService } from '../../../../services/vehicle-picker-modal.service';
import { Observable, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { fromOutsideClick } from '../../../../functions/rxjs/from-outside-click';
import { delay, filter, switchMap, takeUntil } from 'rxjs/operators';
import { CartService } from '../../../../services/cart.service';
import { VehicleApi } from '../../../../api/base';
import { TranslateService } from '@ngx-translate/core';
import { WishlistService } from '../../../../services/wishlist.service';

@Component({
    selector: 'app-mobile-header',
    templateUrl: './mobile-header.component.html',
    styleUrls: ['./mobile-header.component.scss'],
})
export class MobileHeaderComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroy$: Subject<void> = new Subject<void>();

    vehiclePickerIsOpen = false;

    searchIsOpen = false;

    searchPlaceholder$: Observable<string>;

    @HostBinding('class.mobile-header') classMobileHeader = true;

    @ViewChild('searchForm') searchForm: ElementRef<HTMLElement>;

    @ViewChild('searchInput') searchInput: ElementRef<HTMLElement>;

    @ViewChild('searchIndicator') searchIndicator: ElementRef<HTMLElement>;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private vehiclesApi: VehicleApi,
        private translate: TranslateService,
        public menu: MobileMenuService,
        public vehiclePicker: VehiclePickerModalService,
        public cart: CartService,
        public wishlist: WishlistService,
    ) { }

    ngOnInit(): void {
        this.searchPlaceholder$ = this.vehiclesApi.currentVehicle$.pipe(
            switchMap(vehicle => {
                if (vehicle) {
                    return this.translate.stream('INPUT_SEARCH_PLACEHOLDER_VEHICLE', vehicle);
                }

                return this.translate.stream('INPUT_SEARCH_PLACEHOLDER');
            }),
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.zone.runOutsideAngular(() => {
            fromOutsideClick([
                this.searchForm.nativeElement,
                this.searchIndicator.nativeElement,
            ]).pipe(
                filter(() => this.searchIsOpen && !this.vehiclePickerIsOpen),
                takeUntil(this.destroy$),
            ).subscribe(() => {
                this.zone.run(() => this.closeSearch());
            });
        });
    }

    openSearch(): void {
        this.searchIsOpen = true;

        if (this.searchInput.nativeElement) {
            this.searchInput.nativeElement.focus();
        }
    }

    closeSearch(): void {
        this.searchIsOpen = false;
    }

    openVehiclePicker(): void {
        this.vehiclesApi.currentVehicle$.pipe(
            switchMap(vehicle => {
                this.vehiclePickerIsOpen = true;

                const session = this.vehiclePicker.show(vehicle);

                session.close$.pipe(
                    delay(10),
                    takeUntil(this.destroy$),
                ).subscribe(() => {
                    this.vehiclePickerIsOpen = false;
                    this.searchInput.nativeElement.focus();
                });

                return session.select$.asObservable();
            }),
            takeUntil(this.destroy$),
        ).subscribe(vehicle => {
            this.vehiclesApi.setCurrentVehicle(vehicle);
        });
    }
}
