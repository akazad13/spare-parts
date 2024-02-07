import {
    AfterViewInit,
    Component,
    ElementRef, HostBinding,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { VehicleApi } from '../../../../api/base';
import { fromEvent, Observable, Subject } from 'rxjs';
import { Vehicle } from '../../../../interfaces/vehicle';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Product } from '../../../../interfaces/product';
import { ShopCategory } from '../../../../interfaces/category';
import { UrlService } from '../../../../services/url.service';
import { ShopApi } from '../../../../api/base';
import { isPlatformBrowser } from '@angular/common';
import { fromOutsideClick } from '../../../../functions/rxjs/from-outside-click';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroy$: Subject<void> = new Subject<void>();

    query$: Subject<string> = new Subject<string>();

    suggestionsIsOpen = false;

    hasSuggestions = false;

    searchPlaceholder$: Observable<string>;

    vehiclePickerIsOpen = false;

    vehiclePanel: 'list'|'form' = 'list';

    vehicles$: Observable<Vehicle[]>;

    currentVehicle$: Observable<Vehicle>;

    currentVehicleControl: FormControl = new FormControl(null);

    addVehicleControl: FormControl = new FormControl(null);

    products: Product[] = [];

    categories: ShopCategory[] = [];

    @HostBinding('class.search') classSearch = true;

    @ViewChild('selectVehicleButton') selectVehicleButton: ElementRef<HTMLElement>;

    @ViewChild('vehiclePickerDropdown') vehiclePickerDropdown: ElementRef<HTMLElement>;

    get element(): HTMLElement { return this.elementRef.nativeElement; }

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private vehiclesApi: VehicleApi,
        private shopApi: ShopApi,
        private translate: TranslateService,
        private elementRef: ElementRef,
        public url: UrlService,
    ) { }

    ngOnInit(): void {
        this.vehicles$ = this.vehiclesApi.userVehicles$;
        this.currentVehicle$ = this.vehiclesApi.currentVehicle$;

        this.currentVehicleControl.valueChanges.pipe(
            switchMap(vehicleId => this.vehiclesApi.userVehicles$.pipe(
                map(vehicles => vehicles.find(x => x.id === vehicleId) || null)),
            ),
        ).subscribe(vehicle => this.vehiclesApi.setCurrentVehicle(vehicle));

        this.currentVehicle$.subscribe(vehicle => this.currentVehicleControl.setValue(vehicle ? vehicle.id : null, {emitEvent: false}));

        this.query$.pipe(
            distinctUntilChanged(),
            switchMap(query => this.shopApi.getSearchSuggestions(query, {
                limitProducts: 3,
                limitCategories: 4,
            })),
            takeUntil(this.destroy$),
        ).subscribe(result => {
            if (result.products.length === 0 && result.categories.length === 0) {
                this.hasSuggestions = false;
                return;
            }

            this.hasSuggestions = true;
            this.products = result.products;
            this.categories = result.categories;
        });

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
                this.selectVehicleButton.nativeElement,
                this.vehiclePickerDropdown.nativeElement,
            ]).pipe(
                filter(() => this.vehiclePickerIsOpen),
                takeUntil(this.destroy$),
            ).subscribe(() => {
                this.zone.run(() => this.vehiclePickerIsOpen = false);
            });

            fromOutsideClick(this.element).pipe(
                filter(() => this.suggestionsIsOpen),
                takeUntil(this.destroy$),
            ).subscribe(() => {
                this.zone.run(() => this.toggleSuggestions(false));
            });

            fromEvent(this.element, 'focusout').pipe(
                debounceTime(10),
                takeUntil(this.destroy$),
            ).subscribe(() => {
                if (document.activeElement === document.body) {
                    return;
                }

                // Close suggestions if the focus received an external element.
                if (document.activeElement && document.activeElement.closest('.search') !== this.element) {
                    this.zone.run(() => this.toggleSuggestions(false));
                }
            });
        });
    }

    search(query: string): void {
        this.query$.next(query);
    }

    toggleSuggestions(force?: boolean): void {
        this.suggestionsIsOpen = force !== undefined ? force : !this.suggestionsIsOpen;

        if (this.suggestionsIsOpen) {
            this.toggleVehiclePicker(false);
        }
    }

    toggleVehiclePicker(force?: boolean): void {
        this.vehiclePickerIsOpen = force !== undefined ? force : !this.vehiclePickerIsOpen;

        if (this.vehiclePickerIsOpen) {
            this.toggleSuggestions(false);
        }
    }

    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;

        this.search(input.value);
    }

    onInputFocus(event: FocusEvent): void {
        const input = event.target as HTMLInputElement;

        this.toggleSuggestions(true);
        this.search(input.value);
    }
}
