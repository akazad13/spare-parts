import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

@Directive({
    selector: '[appFakeSlides]',
    exportAs: 'appFakeSlides',
})
export class FakeSlidesDirective implements OnInit, OnChanges, OnDestroy {
    @Input() options;
    @Input() appFakeSlides = 0;

    private resizeHandler;

    slides = [];
    slidesCount = 0;

    constructor(
        private eventManager: EventManager,
        private el: ElementRef,
    ) { }

    ngOnInit(): void {
        this.resizeHandler = this.eventManager.addGlobalEventListener('window', 'resize', () => this.calc());
        this.calc();
    }

    calc(): void {
        let newFakeSlidesCount = 0;

        if (this.options) {
            let match = -1;
            const viewport = this.el.nativeElement.querySelector('.owl-carousel').clientWidth;
            const overwrites = this.options.responsive;

            if (overwrites) {
                for (const key in overwrites) {
                    if (overwrites.hasOwnProperty(key)) {
                        if (+key <= viewport && +key > match) {
                            match = Number(key);
                        }
                    }
                }
            }

            if (match >= 0) {
                const items = overwrites[match].items;
                newFakeSlidesCount = Math.max(0, items - this.appFakeSlides);
            } else if (this.options.items) {
                newFakeSlidesCount = Math.max(0, this.options.items - this.appFakeSlides);
            }
        }

        if (this.slidesCount !== newFakeSlidesCount) {
            this.slides = [];
            this.slidesCount = newFakeSlidesCount;

            for (let i = 0; i < newFakeSlidesCount; i++) {
                this.slides.push(i);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.calc();
    }

    ngOnDestroy(): void {
        if (this.resizeHandler) {
            this.resizeHandler();
        }
    }
}
