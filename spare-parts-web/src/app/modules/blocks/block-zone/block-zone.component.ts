import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ShopCategory } from '../../../interfaces/category';
import { UrlService } from '../../../services/url.service';
import { ShopApi } from '../../../api/base';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { Product } from '../../../interfaces/product';
import { shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { CarouselComponent } from 'ngx-owl-carousel-o';
import { LanguageService } from '../../language/services/language.service';

interface BlockZoneTab {
    name: string;
    products$: Observable<Product[]>;
}

@Component({
    selector: 'app-block-zone',
    templateUrl: './block-zone.component.html',
    styleUrls: ['./block-zone.component.scss'],
})
export class BlockZoneComponent implements OnChanges, OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    carouselOptions: Partial<OwlCarouselOConfig>;

    loading = true;

    showCarousel = true;

    children: ShopCategory[] = [];

    tabs: BlockZoneTab[] = [];

    get currentTab(): BlockZoneTab { return this.currentTab$.value; }

    currentTab$: BehaviorSubject<BlockZoneTab>;

    products$: Observable<Product[]>;

    @Input() image: string;

    @Input() mobileImage: string;

    @Input() category: ShopCategory;

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-zone') classBlockZone = true;

    @ViewChild(CarouselComponent) carousel: CarouselComponent;

    constructor(
        private shopApi: ShopApi,
        private language: LanguageService,
        private cd: ChangeDetectorRef,
        public url: UrlService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.category) {
            this.children = this.category.children ? this.category.children.slice(0, 7) : [];
        }
    }

    ngOnInit(): void {
        // Since ngx-owl-carousel-o cannot re-initialize itself, we will do it manually when the direction changes.
        this.language.directionChange$.pipe(
            switchMap(() => timer(250)),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            this.initOptions();

            this.showCarousel = false;
            this.cd.detectChanges();
            this.showCarousel = true;
        });

        this.tabs = [
            {
                name: 'TEXT_TAB_FEATURED',
                products$: this.shopApi.getFeaturedProducts(this.category.slug, 6),
            },
            {
                name: 'TEXT_TAB_BESTSELLERS',
                products$: this.shopApi.getPopularProducts(this.category.slug, 6),
            },
            {
                name: 'TEXT_TAB_TOP_RATED',
                products$: this.shopApi.getTopRatedProducts(this.category.slug, 6),
            },
        ];

        this.currentTab$ = new BehaviorSubject<BlockZoneTab>(this.tabs[0]);
        this.products$ = this.currentTab$.pipe(
            tap(() => this.loading = true),
            switchMap(tab => tab.products$),
            tap(() => {
                this.loading = false;

                // Well, this is just another hack to get owl-carousel-o to work as expected
                this.initOptions();

                this.showCarousel = false;
                this.cd.detectChanges();
                this.showCarousel = true;
            }),
            shareReplay(1),
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setCurrentTab(tab: BlockZoneTab): void {
        this.currentTab$.next(tab);
    }

    initOptions(): void {
        this.carouselOptions = {
            dots: false,
            margin: 20,
            loop: true,
            items: 4,
            rtl: this.language.isRTL(),
            responsive: {
                1020: {items: 4, margin: 20},
                630: {items: 3, margin: 16},
                410: {items: 2, margin: 16},
                0: {items: 1},
            },
        };
    }
}
