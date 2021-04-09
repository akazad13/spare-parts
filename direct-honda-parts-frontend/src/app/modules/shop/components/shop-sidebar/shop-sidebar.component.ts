import { Component, HostBinding, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ShopSidebarService } from '../../services/shop-sidebar.service';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { fromMatchMedia } from '../../../../functions/rxjs/from-match-media';
import { Product } from '../../../../interfaces/product';
import { ShopApi } from '../../../../api/base';

@Component({
    selector: 'app-shop-sidebar',
    templateUrl: './shop-sidebar.component.html',
    styleUrls: ['./shop-sidebar.component.scss'],
})
export class ShopSidebarComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    latestProducts$: Observable<Product[]> = of([]);

    @Input() offcanvas: 'always' | 'mobile';

    @HostBinding('class.sidebar') classSidebar = true;

    @HostBinding('class.sidebar--offcanvas--always') get classSidebarOffcanvasAlways(): boolean {
        return this.offcanvas === 'always';
    }

    @HostBinding('class.sidebar--offcanvas--mobile') get classSidebarOffcanvasMobile(): boolean {
        return this.offcanvas === 'mobile';
    }

    @HostBinding('class.sidebar--open') get classSidebarOpen(): boolean {
        return this.sidebar.isOpen;
    }

    constructor(
        private shop: ShopApi,
        public sidebar: ShopSidebarService,
        @Inject(PLATFORM_ID) private platformId: any,
    ) {
        this.sidebar.isOpen$.pipe(
            takeUntil(this.destroy$),
        ).subscribe(isOpen => {
            if (isOpen) {
                this.open();
            } else {
                this.close();
            }
        });

        if (isPlatformBrowser(this.platformId)) {
            fromMatchMedia('(max-width: 991px)').pipe(takeUntil(this.destroy$)).subscribe(media => {
                if (this.offcanvas === 'mobile' && this.sidebar.isOpen && !media.matches) {
                    this.sidebar.close();
                }
            });
        }
    }

    ngOnInit(): void {
        this.latestProducts$ = this.shop.getLatestProducts(5);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private open(): void {
        if (isPlatformBrowser(this.platformId)) {
            const bodyWidth = document.body.offsetWidth;

            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = (document.body.offsetWidth - bodyWidth) + 'px';
        }
    }

    private close(): void {
        if (isPlatformBrowser(this.platformId)) {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    }
}
