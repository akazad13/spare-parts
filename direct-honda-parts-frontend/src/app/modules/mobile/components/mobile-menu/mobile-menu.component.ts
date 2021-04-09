import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    HostBinding,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { MobileMenuService } from '../../../../services/mobile-menu.service';
import { MobileMenuPanelComponent } from '../mobile-menu-panel/mobile-menu-panel.component';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { mobileMenuLinks } from '../../../../../data/mobile-menu';
import { MobileMenuLink } from '../../../../interfaces/mobile-menu-link';

interface StackItem {
    content: TemplateRef<any>;
    componentRef: ComponentRef<MobileMenuPanelComponent>;
}

@Component({
    selector: 'app-mobile-menu',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    private destroy$: Subject<void> = new Subject<void>();

    links = mobileMenuLinks;

    currentLevel = 0;

    panelsStack: StackItem[] = [];
    panelsBin: StackItem[] = [];

    forceConveyorTransition = false;

    @HostBinding('class.mobile-menu') classMobileMenu = true;

    @HostBinding('class.mobile-menu--open') get classMobileMenuOpen() {
        return this.menu.isOpen;
    }

    @ViewChild('body') body: ElementRef;

    @ViewChild('conveyor') conveyor: ElementRef;

    @ViewChild('panelsContainer', {read: ViewContainerRef}) panelsContainer: ViewContainerRef;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private cfr: ComponentFactoryResolver,
        private zone: NgZone,
        public menu: MobileMenuService,
    ) { }

    ngOnInit(): void {
        this.menu.onOpenPanel.pipe(takeUntil(this.destroy$)).subscribe(({content, label}) => {
            if (this.panelsStack.findIndex(x => x.content === content) !== -1) {
                return;
            }

            const componentFactory = this.cfr.resolveComponentFactory(MobileMenuPanelComponent);
            const componentRef = this.panelsContainer.createComponent(componentFactory);

            componentRef.instance.label = label;
            componentRef.instance.content = content;
            componentRef.instance.level = this.panelsStack.length + 1;

            this.panelsStack.push({content, componentRef});
            this.currentLevel += 1;

            this.removeUnusedPanels();
        });
        this.menu.onCloseCurrentPanel.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.panelsStack.length < 1) {
                return;
            }

            this.panelsBin.push(this.panelsStack.pop());
            this.currentLevel -= 1;

            if (!isPlatformBrowser(this.platformId)) {
                this.removeUnusedPanels();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                fromEvent(this.body.nativeElement, 'transitionend').pipe(
                    takeUntil(this.destroy$),
                ).subscribe((event: TransitionEvent) => {
                    if (event.target === this.body.nativeElement && event.propertyName === 'transform' && !this.menu.isOpen) {
                        this.zone.run(() => this.onMenuClosed());
                    }
                });

                fromEvent(this.conveyor.nativeElement, 'transitionend').pipe(
                    takeUntil(this.destroy$),
                ).subscribe((event: TransitionEvent) => {
                    if (event.target === this.conveyor.nativeElement && event.propertyName === 'transform') {
                        this.zone.run(() => this.onConveyorStopped());
                    }
                });
            });
        }
    }

    ngAfterViewChecked(): void {
        if (this.forceConveyorTransition) {
            this.forceConveyorTransition = false;

            if (isPlatformBrowser(this.platformId)) {
                this.conveyor.nativeElement.style.transition = 'none';
                this.conveyor.nativeElement.getBoundingClientRect(); // force reflow
                this.conveyor.nativeElement.style.transition = '';
            }
        }
    }

    onMenuClosed(): void {
        while (this.panelsStack.length > 0) {
            this.panelsBin.push(this.panelsStack.pop());
            this.currentLevel -= 1;
        }

        this.removeUnusedPanels();
        this.forceConveyorTransition = true;
    }

    onConveyorStopped(): void {
        this.removeUnusedPanels();
    }

    removeUnusedPanels(): void {
        while (this.panelsBin.length > 0) {
            this.panelsBin.pop().componentRef.destroy();
        }
    }

    onLinkClick(item: MobileMenuLink): void {
        if (!item.submenu || item.submenu.length < 1) {
            this.menu.close();
        }
    }
}
