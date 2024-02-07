import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { testimonials } from '../../../../../data/site-testimonials';
import { LanguageService } from '../../../language/services/language.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';

@Component({
    selector: 'app-block-reviews',
    templateUrl: './block-reviews.component.html',
    styleUrls: ['./block-reviews.component.scss'],
})
export class BlockReviewsComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    showCarousel = true;

    testimonials = testimonials;

    carouselOptions: Partial<OwlCarouselOConfig>;

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-reviews') classBlockReviews = true;

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
            dots: true,
            margin: 20,
            items: 1,
            loop: true,
            rtl: this.language.isRTL(),
            responsive: {
                0: {items: 1},
            },
        };
    }
}
