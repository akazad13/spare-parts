import { AfterContentInit, ContentChild, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CollapseContentDirective } from './collapse-content.directive';


@Directive({
    selector: '[appCollapseItem]',
    exportAs: 'appCollapseItem',
})
export class CollapseItemDirective implements OnDestroy, AfterContentInit {
    private destroy$: Subject<any> = new Subject();

    contentInitialized = false;

    @Input() appCollapseItem: string;

    @Input('appCollapseItemIsOpen')
    set isOpen(value: boolean) {
        this.toggle(value);
    }
    get isOpen(): boolean {
        return this.element.classList.contains(this.class);
    }

    @ContentChild(CollapseContentDirective, {read: ElementRef}) content: ElementRef;

    get class(): string {
        return this.appCollapseItem;
    }

    get element(): HTMLElement {
        return this.el.nativeElement;
    }

    constructor(
        private zone: NgZone,
        private el: ElementRef,
    ) { }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterContentInit(): void {
        this.zone.runOutsideAngular(() => {
            fromEvent<TransitionEvent>(this.contentElement(), 'transitionend').pipe(
                takeUntil(this.destroy$),
            ).subscribe(event => {
                if (event.target === this.contentElement() && event.propertyName === 'height') {
                    this.contentElement().style.height = '';
                }
            });
        });

        this.contentInitialized = true;
    }

    toggle(value?: boolean): void {
        value = value !== undefined ? value : !this.isOpen;

        if (value === this.isOpen) {
            return;
        }

        if (value) {
            this.open();
        } else {
            this.close();
        }
    }

    open(): void {
        const content = this.contentElement();

        if (content && this.contentInitialized) {
            const startHeight = content.getBoundingClientRect().height;

            this.element.classList.add(this.class);

            const endHeight = content.getBoundingClientRect().height;

            content.style.height = `${startHeight}px`;
            this.element.getBoundingClientRect(); // force reflow
            content.style.height = `${endHeight}px`;
        } else {
            this.element.classList.add(this.class);
        }
    }

    close(): void {
        const content = this.contentElement();

        if (content && this.contentInitialized) {
            const startHeight = content.getBoundingClientRect().height;

            content.style.height = `${startHeight}px`;
            this.element.classList.remove(this.class);

            this.element.getBoundingClientRect(); // force reflow

            content.style.height = '';
        } else {
            this.element.classList.remove(this.class);
        }
    }

    private contentElement(): HTMLElement {
        return this.content ? this.content.nativeElement : this.element;
    }
}
