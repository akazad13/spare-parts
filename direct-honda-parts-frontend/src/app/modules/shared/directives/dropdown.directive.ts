import { Directive, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { fromOutsideClick } from '../../../functions/rxjs/from-outside-click';
import { filter, takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appDropdown]',
    exportAs: 'appDropdown',
})
export class DropdownDirective implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    isOpen = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private elementRef: ElementRef<HTMLElement>,
    ) { }

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.zone.runOutsideAngular(() => {
            fromOutsideClick(this.elementRef.nativeElement).pipe(
                filter(() => this.isOpen),
                takeUntil(this.destroy$),
            ).subscribe(() => {
                this.zone.run(() => this.close());
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    open(): void {
        this.toggle(true);
    }

    close(): void {
        this.toggle(false);
    }

    toggle(forceValue: boolean = null): void {
        if (forceValue !== null) {
            this.isOpen = forceValue;
        } else {
            this.isOpen = !this.isOpen;
        }
    }
}
