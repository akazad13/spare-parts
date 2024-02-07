import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { teammates } from '../../../../../data/site-teammates';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { LanguageService } from '../../../language/services/language.service';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';

@Component({
    selector: 'app-block-teammates',
    templateUrl: './block-teammates.component.html',
    styleUrls: ['./block-teammates.component.scss'],
})
export class BlockTeammatesComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    teammates = teammates;

    showCarousel = true;

    carouselOptions: Partial<OwlCarouselOConfig>;

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-teammates') classBlockTeammates = true;

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
            rtl: this.language.isRTL(),
            responsive: {
                1100: {items: 5},
                930: {items: 4},
                690: {items: 3},
                380: {items: 2},
                0: {items: 1},
            },
        };
    }
}
