import { Directive, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

/**
 * This directive adds the "owl-prevent-click" class to the .owl-carousel element when dragging.
 * When the class "owl-prevent-click" is applied to an element, a pseudo-element is created and
 * a mouseup event occurs on it, which prevents clicking.
 */
@Directive({
    selector: '[appOwlPreventClick]',
})
export class OwlPreventClickDirective implements OnInit {
    private get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private elementRef: ElementRef,
        private zone: NgZone,
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                const children: Element[] = [].slice.call(this.element.children);
                const owlCarouseElement = children.find(element => element.classList.contains('owl-carousel'));

                fromEvent<MouseEvent>(owlCarouseElement, 'mousedown').subscribe(mouseDownEvent => {
                    const timeout = setTimeout(() => {
                        owlCarouseElement.classList.add('owl-prevent-click');
                    }, 250);
                    const mouseUpEvent$ = fromEvent<MouseEvent>(document, 'mouseup').pipe(take(1));

                    fromEvent<MouseEvent>(document, 'mousemove').pipe(
                        takeUntil(mouseUpEvent$),
                        map(mouseMoveEvent => Math.abs(Math.sqrt(
                            Math.pow(mouseDownEvent.clientX - mouseMoveEvent.clientX, 2) +
                            Math.pow(mouseDownEvent.clientY - mouseMoveEvent.clientY, 2),
                        ))),
                        filter(distance => distance > 15),
                        take(1),
                    ).subscribe(() => {
                        owlCarouseElement.classList.add('owl-prevent-click');
                    });

                    mouseUpEvent$.subscribe(() => {
                        owlCarouseElement.classList.remove('owl-prevent-click');

                        clearTimeout(timeout);
                    });
                });
            });
        }
    }
}
