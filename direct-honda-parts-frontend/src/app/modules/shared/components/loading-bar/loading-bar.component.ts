import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    NgZone,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

function isNavigationStart(event: Event): boolean {
    return event instanceof NavigationStart;
}

function isNavigationEnd(event: Event): boolean {
    return event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel;
}

@Component({
    selector: 'app-loading-bar',
    templateUrl: './loading-bar.component.html',
    styleUrls: ['./loading-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBarComponent implements OnDestroy, AfterViewInit {
    private destroy$: Subject<void> = new Subject();

    @ViewChild('bar') bar: ElementRef;

    get element(): HTMLElement {
        return this.bar.nativeElement;
    }

    constructor(
        private router: Router,
        private zone: NgZone,
    ) { }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit(): void {
        let timer;

        this.zone.runOutsideAngular(() => {
            this.router.events.pipe(
                takeUntil(this.destroy$),
            ).subscribe(event => {
                if (isNavigationStart(event)) {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        this.element.classList.remove(
                            'loading-bar--start',
                            'loading-bar--complete',
                            'loading-bar--reset',
                        );
                        this.element.getBoundingClientRect(); // force reflow
                        this.element.classList.add('loading-bar--start');
                    }, 50);
                }

                if (isNavigationEnd(event)) {
                    clearTimeout(timer);
                    if (this.element.classList.contains('loading-bar--start')) {
                        this.element.classList.remove('loading-bar--start');
                        this.element.classList.add('loading-bar--complete');
                    }
                }
            });
        });
    }
}
