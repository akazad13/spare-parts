import {
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input, NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { fromOutsideClick } from '../../../../functions/rxjs/from-outside-click';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-indicator',
    templateUrl: './indicator.component.html',
    styleUrls: ['./indicator.component.scss'],
    exportAs: 'indicator',
})
export class IndicatorComponent implements OnChanges, OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    href: string;

    @Input() link: string;

    @Input() icon: string;

    @Input() label: string;

    @Input() value: string;

    @Input() counter: string|number;

    @Input() trigger: string;

    @HostBinding('class.indicator') classIndicator = true;

    @HostBinding('class.indicator--open') classIndicatorOpen = false;

    @HostBinding('class.indicator--trigger--click') get classIndicatorTriggerClick(): boolean {
        return this.trigger === 'click';
    }

    @HostBinding('class.indicator--trigger--hover') get classIndicatorTriggerHover(): boolean {
        return this.trigger === 'hover';
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private elementRef: ElementRef<HTMLElement>,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if ('link' in changes) {
            this.href = this.router.createUrlTree([this.link], {relativeTo: this.route}).toString();
        }
    }

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.zone.runOutsideAngular(() => {
            fromOutsideClick(this.elementRef.nativeElement).pipe(
                filter(() => this.classIndicatorOpen),
                takeUntil(this.destroy$),
            ).subscribe(() => {
                this.zone.run(() => this.classIndicatorOpen = false);
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onClick(event: MouseEvent) {
        if (!event.cancelable) {
            return;
        }

        event.preventDefault();

        if (this.trigger !== 'click') {
            this.router.navigate([this.link], {relativeTo: this.route}).then();
        }

        this.classIndicatorOpen = !this.classIndicatorOpen;
    }

    close(): void {
        this.classIndicatorOpen = false;
    }
}
