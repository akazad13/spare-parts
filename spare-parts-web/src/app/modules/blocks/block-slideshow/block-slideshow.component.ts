import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { LanguageService } from '../../language/services/language.service';

export interface BlockSlideshowSlide {
    url: string;
    desktopImage: string;
    mobileImage: string;
    offer?: string;
    title: string;
    details: string;
    buttonLabel: string;
}

@Component({
    selector: 'app-block-slideshow',
    templateUrl: './block-slideshow.component.html',
    styleUrls: ['./block-slideshow.component.scss'],
})
export class BlockSlideshowComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    showCarousel = true;

    carouselOptions: Partial<OwlCarouselOConfig>;

    @Input() slides: BlockSlideshowSlide[] = [];

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-slideshow') classBlockSlideshow = true;

    constructor(
        private language: LanguageService,
        private cd: ChangeDetectorRef,
    ) { }

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
            items: 1,
            dots: true,
            loop: true,
            rtl: this.language.isRTL(),
        };
    }
}
