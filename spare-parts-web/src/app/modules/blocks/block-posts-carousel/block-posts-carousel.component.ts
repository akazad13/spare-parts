import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit, SimpleChanges,
    ViewChild,
} from '@angular/core';
import { SectionHeaderLink } from '../../shared/components/section-header/section-header.component';
import { CarouselComponent } from 'ngx-owl-carousel-o';
import { Subject, timer } from 'rxjs';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { LanguageService } from '../../language/services/language.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Post } from '../../../interfaces/post';

export type BlockPostsCarouselLayout = 'grid' | 'list';

const carouselLayoutOptions = {
    grid: {
        items: 4,
        responsive: {
            1350: {items: 4, margin: 20},
            1110: {items: 3, margin: 20},
            930: {items: 3, margin: 16},
            690: {items: 2, margin: 16},
            0: {items: 1, margin: 16},
        },
    },
    list: {
        items: 2,
        responsive: {
            1350: {items: 2, margin: 20},
            930: {items: 2, margin: 16},
            0: {items: 1, margin: 16},
        },
    },
};

@Component({
    selector: 'app-block-posts-carousel',
    templateUrl: './block-posts-carousel.component.html',
    styleUrls: ['./block-posts-carousel.component.scss'],
})
export class BlockPostsCarouselComponent implements OnChanges, OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    showCarousel = true;

    carouselOptions: Partial<OwlCarouselOConfig>;

    @Input() label: string;

    @Input() loading = false;

    @Input() layout: BlockPostsCarouselLayout = 'grid';

    @Input() links: SectionHeaderLink[] = [];

    @Input() posts: Post[] = [];

    @HostBinding('class.block') classBlock = true;

    @HostBinding('class.block-posts-carousel') classBlockPostsCarousel = true;

    @HostBinding('class.block-posts-carousel--loading') get classBlockPostsCarouselLoading(): boolean {
        return this.loading;
    }

    @HostBinding('class.block-posts-carousel--layout--grid') get classBlockPostsCarouselLayoutGrid(): boolean {
        return this.layout === 'grid';
    }

    @HostBinding('class.block-posts-carousel--layout--list') get classBlockPostsCarouselLayoutList(): boolean {
        return this.layout === 'list';
    }

    @ViewChild(CarouselComponent) carousel: CarouselComponent;

    constructor(
        private language: LanguageService,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.posts) {
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
        this.carouselOptions = Object.assign({
            dots: false,
            margin: 20,
            loop: true,
            rtl: this.language.isRTL(),
        }, carouselLayoutOptions[this.layout]);
    }
}
