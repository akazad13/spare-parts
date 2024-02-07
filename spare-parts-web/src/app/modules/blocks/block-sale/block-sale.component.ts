import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges, ViewChild,
} from '@angular/core';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { LanguageService } from '../../language/services/language.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { Product } from '../../../interfaces/product';
import { CarouselComponent } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-block-sale',
    templateUrl: './block-sale.component.html',
    styleUrls: ['./block-sale.component.scss'],
})
export class BlockSaleComponent implements OnChanges, OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    showCarousel = true;

    carouselOptions: Partial<OwlCarouselOConfig>;

    @Input() loading = false;

    @Input() products: Product[] = [];

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-sale') classBlockSale = true;

    @HostBinding('class.block-sale--loading') get classBlockSaleLoading() { return this.loading; }

    @ViewChild(CarouselComponent) carousel: CarouselComponent;

    constructor(
        private language: LanguageService,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.products) {
            // Well, this is just another hack to get owl-carousel-o to work as expected
            setTimeout(() => {
                this.initOptions();

                this.showCarousel = false;
                this.cd.detectChanges();
                this.showCarousel = true;
            }, 0);
        }
    }

    ngOnInit(): void {
        this.initOptions();

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
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    initOptions(): void {
        this.carouselOptions = {
            items: 5,
            dots: false,
            margin: 24,
            loop: true,
            rtl: this.language.isRTL(),
            responsive: {
                1350: {items: 5, margin: 24},
                1110: {items: 4, margin: 24},
                930: {items: 4, margin: 16},
                690: {items: 3, margin: 16},
                410: {items: 2, margin: 16},
                0: {items: 1},
            },
        };
    }
}
