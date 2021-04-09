import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { PhotoSwipeItem, PhotoSwipeService, PhotoSwipeThumbBounds } from '../../../../services/photo-swipe.service';
import { CarouselComponent, SlidesOutputData } from 'ngx-owl-carousel-o';
import { LanguageService } from '../../../language/services/language.service';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

export type ProductGalleryLayout = 'product-sidebar' | 'product-full' | 'quickview';

export interface ProductGalleryItem {
    id: string;
    image: string;
}

@Component({
    selector: 'app-product-gallery',
    templateUrl: './product-gallery.component.html',
    styleUrls: ['./product-gallery.component.scss'],
})
export class ProductGalleryComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    items: ProductGalleryItem[] = [];

    currentItem: ProductGalleryItem = null;

    showGallery = true;

    carouselOptions: Partial<OwlCarouselOConfig>;

    thumbnailsCarouselOptions: Partial<OwlCarouselOConfig>;

    @Input() set images(images: string[]) {
        this.items = images.map((image, index) => ({id: `image-${index}`, image}));
        this.currentItem = this.items[0] || null;
    }

    @Input() @HostBinding('attr.data-layout') layout: ProductGalleryLayout;

    @ViewChild('featuredCarousel', { read: CarouselComponent }) featuredCarousel: CarouselComponent;

    @ViewChild('thumbnailsCarousel', { read: CarouselComponent }) thumbnailsCarousel: CarouselComponent;

    @ViewChildren('imageElement', {read: ElementRef}) imageElements: QueryList<ElementRef>;

    @HostBinding('class.product-gallery') classProductGallery = true;

    @HostBinding('class.product-gallery--layout--product-full') get classProductGalleryLayoutProductFull(): boolean {
        return this.layout === 'product-full';
    }

    @HostBinding('class.product-gallery--layout--product-sidebar') get classProductGalleryLayoutProductSidebar(): boolean {
        return this.layout === 'product-sidebar';
    }

    @HostBinding('class.product-gallery--layout--quickview') get classProductGalleryLayoutQuickview(): boolean {
        return this.layout === 'quickview';
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private language: LanguageService,
        private photoSwipe: PhotoSwipeService,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.initOptions();

        if (this.layout !== 'quickview' && isPlatformBrowser(this.platformId)) {
            this.photoSwipe.load().subscribe();
        }

        // Since ngx-owl-carousel-o cannot re-initialize itself, we will do it manually when the direction changes.
        this.language.directionChange$.pipe(
            switchMap(() => timer(250)),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            this.initOptions();
            this.currentItem = this.items[0] || null;

            this.showGallery = false;
            this.cd.detectChanges();
            this.showGallery = true;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    featuredCarouselTranslated(event: SlidesOutputData): void {
        if (event.slides.length) {
            const activeImageId = event.slides[0].id;

            this.currentItem = this.items.find(x => x.id === activeImageId) || this.items[0] || null;

            if (!this.thumbnailsCarousel.slidesData.find(slide => slide.id === activeImageId && slide.isActive)) {
                this.thumbnailsCarousel.to(activeImageId);
            }
        }
    }

    getDirDependentIndex(index) {
        // we need to invert index id direction === 'rtl' because photoswipe do not support rtl
        if (this.language.isRTL()) {
            return this.items.length - 1 - index;
        }

        return index;
    }

    onFeaturedImageClick(event: MouseEvent, image: any): void {
        if (this.layout !== 'quickview') {
            event.preventDefault();

            this.openPhotoSwipe(image);
        }
    }

    onThumbnailImageClick(item: ProductGalleryItem): void {
        this.featuredCarousel.to(item.id);
        this.currentItem = item;
    }

    openPhotoSwipe(item: ProductGalleryItem): void {
        if (!item) {
            return;
        }

        const imageElements = this.imageElements.map(x => x.nativeElement);
        const images: PhotoSwipeItem[] = this.items.map((eachItem, i) => {
            const tag: HTMLImageElement = imageElements[i];
            const width = parseFloat(tag.dataset.width) || tag.naturalWidth;
            const height = parseFloat(tag.dataset.height) || tag.naturalHeight;

            return {
                src: eachItem.image,
                msrc: eachItem.image,
                w: width,
                h: height,
            };
        });

        if (this.language.isRTL()) {
            images.reverse();
        }

        const options = {
            getThumbBoundsFn: index => this.getThumbBounds(index),
            index: this.getDirDependentIndex(this.items.indexOf(item)),
            bgOpacity: .9,
            history: false,
        };

        this.photoSwipe.open(images, options).subscribe(galleryRef => {
            galleryRef.listen('beforeChange', () => {
                this.featuredCarousel.to(this.items[this.getDirDependentIndex(galleryRef.getCurrentIndex())].id);
            });
        });
    }

    getThumbBounds(index: number): PhotoSwipeThumbBounds {
        const imageElements = this.imageElements.toArray();
        const dirDependentIndex = this.getDirDependentIndex(index);

        if (!imageElements[dirDependentIndex]) {
            return null;
        }

        const tag = imageElements[dirDependentIndex].nativeElement;
        const width = tag.naturalWidth;
        const height = tag.naturalHeight;
        const rect = tag.getBoundingClientRect();
        const ration = Math.min(rect.width / width, rect.height / height);
        const fitWidth = width * ration;
        const fitHeight = height * ration;

        return {
            x: rect.left + (rect.width - fitWidth) / 2 + window.pageXOffset,
            y: rect.top + (rect.height - fitHeight) / 2 + window.pageYOffset,
            w: fitWidth,
        };
    }

    initOptions(): void {
        this.carouselOptions = {
            dots: false,
            autoplay: false,
            rtl: this.language.isRTL(),
            responsive: {
                0: {items: 1},
            },
        };
        this.thumbnailsCarouselOptions = {
            dots: false,
            autoplay: false,
            margin: 10,
            items: 5,
            rtl: this.language.isRTL(),
            responsive: {
                580: {items: 8, margin: 10},
                520: {items: 7, margin: 10},
                400: {items: 6, margin: 10},
                320: {items: 5, margin: 8},
                260: {items: 4, margin: 8},
                0: {items: 3},
            },
        };
    }
}
