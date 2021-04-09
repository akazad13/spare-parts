import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges, OnDestroy, OnInit,
    Output,
    SimpleChanges, ViewChild,
} from '@angular/core';
import { ProductCardElement, ProductCardLayout } from '../../shared/components/product-card/product-card.component';
import { SectionHeaderGroup, SectionHeaderLink } from '../../shared/components/section-header/section-header.component';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { LanguageService } from '../../language/services/language.service';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { CarouselComponent } from 'ngx-owl-carousel-o';

export type BlockProductsCarouselLayout = 'grid-4' | 'grid-4-sidebar' | 'grid-5' | 'grid-6' | 'horizontal' | 'horizontal-sidebar';

const carouselLayoutOptions = {
    'grid-4': {
        items: 4,
        responsive: {
            1110: {items: 4},
            930: {items: 4, margin: 16},
            690: {items: 3, margin: 16},
            430: {items: 2, margin: 16},
            0: {items: 1},
        },
    },
    'grid-4-sidebar': {
        items: 4,
        responsive: {
            1040: {items: 4},
            818: {items: 3},
            638: {items: 3, margin: 16},
            430: {items: 2, margin: 16},
            0: {items: 1},
        },
    },
    'grid-5': {
        items: 5,
        responsive: {
            1350: {items: 5},
            1110: {items: 4},
            930: {items: 4, margin: 16},
            690: {items: 3, margin: 16},
            430: {items: 2, margin: 16},
            0: {items: 1},
        },
    },
    'grid-6': {
        items: 6,
        margin: 16,
        responsive: {
            1350: {items: 6},
            1110: {items: 5},
            930: {items: 4, margin: 16},
            690: {items: 3, margin: 16},
            430: {items: 2, margin: 16},
            0: {items: 1},
        },
    },
    horizontal: {
        items: 4,
        responsive: {
            1350: {items: 4, margin: 14},
            930: {items: 3, margin: 14},
            690: {items: 2, margin: 14},
            0: {items: 1, margin: 14},
        },
    },
    'horizontal-sidebar': {
        items: 3,
        responsive: {
            1040: {items: 3, margin: 14},
            638: {items: 2, margin: 14},
            0: {items: 1, margin: 14},
        },
    },
};

const productCardLayoutMap: {[layout: string]: ProductCardLayout} = {
    'grid-4': 'grid',
    'grid-4-sidebar': 'grid',
    'grid-5': 'grid',
    'grid-6': 'grid',
    horizontal: 'horizontal',
    'horizontal-sidebar': 'horizontal',
};

const productCardExcludeMap = {
    grid: ['features', 'list-buttons'],
    horizontal: ['actions', 'status-badge', 'features', 'buttons', 'meta'],
};

@Component({
    selector: 'app-block-products-carousel',
    templateUrl: './block-products-carousel.component.html',
    styleUrls: ['./block-products-carousel.component.scss'],
})
export class BlockProductsCarouselComponent implements OnChanges, OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    showCarousel = true;

    carouselOptions: Partial<OwlCarouselOConfig>;

    columns = [];

    @Input() products = [];

    @Input() blockTitle: string;

    @Input() @HostBinding('attr.data-layout') layout: BlockProductsCarouselLayout = 'grid-4';

    @Input() rows = 1;

    @Input() groups: SectionHeaderGroup[] = [];

    @Input() currentGroup: SectionHeaderGroup;

    @Input() links: SectionHeaderLink[] = [];

    @Input() loading = false;

    @Output() changeGroup: EventEmitter<SectionHeaderGroup> = new EventEmitter<SectionHeaderGroup>();

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-products-carousel') classBlockProductsCarousel = true;

    @ViewChild(CarouselComponent) carousel: CarouselComponent;

    get productCardLayout(): ProductCardLayout {
        return productCardLayoutMap[this.layout];
    }

    get productCardExclude(): ProductCardElement[] {
        return productCardExcludeMap[this.productCardLayout];
    }

    constructor(
        private language: LanguageService,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        const properties = Object.keys(changes);

        if (properties.includes('products') || properties.includes('row')) {
            this.columns = [];

            if (this.products && this.rows > 0) {
                const products = this.products.slice();

                while (products.length > 0) {
                    this.columns.push(products.splice(0, this.rows));
                }
            }
        }

        if (changes.products) {
            // Well, this is just another hack to get owl-carousel-o to work as expected
            setTimeout(() => {
                this.initOptions();

                this.showCarousel = false;
                this.cd.detectChanges();
                this.showCarousel = true;
            }, 0);
        }

        if (changes.layout) {
            this.initOptions();
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
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    initOptions(): void {
        this.carouselOptions = Object.assign({
            dots: false,
            margin: 20,
            loop: true,
            rtl: this.language.isRTL(),
        }, carouselLayoutOptions[this.layout]);
    }
}
