import { EventEmitter, Inject, Injectable, PLATFORM_ID, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface OpenPanelEvent {
    label: string;
    content: TemplateRef<any>;
}

@Injectable({
    providedIn: 'root',
})
export class MobileMenuService {
    private isOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

    isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

    onOpenPanel: EventEmitter<OpenPanelEvent> = new EventEmitter<OpenPanelEvent>();

    onCloseCurrentPanel: EventEmitter<void> = new EventEmitter<void>();

    get isOpen(): boolean {
        return this.isOpenSubject.value;
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
    ) { }

    open(): void {
        this.toggle(true);
    }

    close(): void {
        this.toggle(false);
    }

    toggle(force?: boolean): void {
        const isOpen = force !== undefined ? force : !this.isOpenSubject.value;

        if (isOpen === this.isOpenSubject.value) {
            return;
        }

        if (isPlatformBrowser(this.platformId)) {
            if (isOpen) {
                const bodyWidth = document.body.offsetWidth;

                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = (document.body.offsetWidth - bodyWidth) + 'px';
            } else {
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';

                this.isOpenSubject.next(false);
            }
        }

        this.isOpenSubject.next(isOpen);
    }

    openPanel(label: string, panelContent: TemplateRef<any>): void {
        this.onOpenPanel.emit({label, content: panelContent});
    }

    closeCurrentPanel(): void {
        this.onCloseCurrentPanel.next();
    }
}
