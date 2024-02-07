import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding, Inject,
    Input, NgZone, OnChanges,
    OnDestroy, PLATFORM_ID, SimpleChanges,
    ViewChild,
} from '@angular/core';
import { fromMatchMedia } from '../../../../functions/rxjs/from-match-media';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface Breadcrumb {
    label: string;
    url: string;
}

@Component({
    selector: 'app-block-header',
    templateUrl: './block-header.component.html',
    styleUrls: ['./block-header.component.scss'],
})
export class BlockHeaderComponent implements OnChanges, OnDestroy, AfterViewInit, AfterViewChecked {
    private destroy$: Subject<void> = new Subject<void>();

    @Input() pageTitle: string;

    @Input() breadcrumb: Breadcrumb[] = [];

    @Input() afterHeader = true;

    @HostBinding('class.block-header') classBlockHeader = true;

    @HostBinding('class.block-header--has-title') get classBlockHeaderHasTitle(): boolean {
        return !!this.pageTitle;
    }

    @HostBinding('class.block-header--has-breadcrumb') get classBlockHeaderHasBreadcrumb(): boolean {
        return this.breadcrumb.length > 0;
    }

    @ViewChild('titleElement') titleElementRef: ElementRef;

    get titleElement(): HTMLElement {
        return this.titleElementRef?.nativeElement;
    }

    get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    reCalcTitleWidth = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private elementRef: ElementRef,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.pageTitle && !changes.pageTitle.isFirstChange()) {
            this.reCalcTitleWidth = true;
        }
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
            fromMatchMedia('(min-width: 1200px)', false).pipe(
                filter(x => x.matches),
                takeUntil(this.destroy$),
            ).subscribe(() => this.calcTitleWidth());
        });
    }

    ngAfterViewChecked(): void {
        if (this.reCalcTitleWidth) {
            this.reCalcTitleWidth = false;
            this.calcTitleWidth();
        }
    }

    calcTitleWidth(): void {
        // So that breadcrumbs correctly flow around the page title, we need to know its width.
        // This code simply conveys the width of the page title in CSS.

        if (!this.element || !this.titleElement) {
            return;
        }

        const width = this.titleElement.getBoundingClientRect().width;

        this.element.style.setProperty('--block-header-title-width', `${width}px`);
    }
}
