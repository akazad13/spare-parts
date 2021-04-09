import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { ResourcesService } from './resources.service';
import { Observable, Subscriber, from } from 'rxjs';

declare const PhotoSwipe: any;
declare const PhotoSwipeUI_Default: any;

export interface PhotoSwipeModelRef {
    close: () => void;
    listen: (eventName: string, callbackFn: (...args: any) => void) => void;
    getCurrentIndex: () => number;
}

export interface PhotoSwipeItem {
    src: string;
    w: number;
    h: number;
    msrc?: string;
    title?: string;
}

export interface PhotoSwipeThumbBounds {
    x: number;
    y: number;
    w: number;
}

export interface PhotoSwipeOptions {
    index?: number;
    getThumbBoundsFn?: (index: number) => PhotoSwipeThumbBounds;
    showHideOpacity?: boolean;
    bgOpacity?: number;
    loop?: boolean;
    history?: boolean;
}

const template = `
<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
                <div class="pswp__counter"></div>
                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                <!--<button class="pswp__button pswp__button&#45;&#45;share" title="Share"></button>-->
                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                      <div class="pswp__preloader__cut">
                        <div class="pswp__preloader__donut"></div>
                      </div>
                    </div>
                </div>
            </div>
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div>
            </div>
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>
        </div>
    </div>
</div>
`;

@Injectable({
    providedIn: 'root',
})
export class PhotoSwipeService implements OnDestroy {
    initialized = false;
    element: HTMLDivElement;

    constructor(
        private zone: NgZone,
        private resources: ResourcesService,
    ) { }

    load(): Observable<void> {
        return from(this.loadLibrary());
    }

    open(items: PhotoSwipeItem[], options: PhotoSwipeOptions): Observable<PhotoSwipeModelRef> {
        return new Observable(observer => {
            this.zone.runOutsideAngular(() => {
                this.loadLibrary().then(() => {
                    if (observer.closed) {
                        return;
                    }
                    if (!this.initialized) {
                        this.init();
                    }

                    this.createGallery(observer, items, options);
                });
            });
        });
    }

    ngOnDestroy(): void {
        if (this.initialized) {
            this.element.parentElement.removeChild(this.element);
        }
    }

    private createGallery(observer: Subscriber<PhotoSwipeModelRef>, items: PhotoSwipeItem[], options: PhotoSwipeOptions): void {
        let gallery = null;

        gallery = new PhotoSwipe(this.element, PhotoSwipeUI_Default, items, options);
        gallery.listen('destroy', () => this.zone.run(() => {
            gallery = null;
            this.zone.run(() => observer.complete());
        }));
        gallery.init();

        const modelRef: PhotoSwipeModelRef = {
            close: () => gallery.close(),
            listen: (eventName, callbackFn) => gallery.listen(eventName, (...args) => {
                this.zone.run(() => callbackFn(...args));
            }),
            getCurrentIndex: () => gallery.getCurrentIndex(),
        };

        observer.add(() => {
            if (gallery) {
                gallery.destroy();
            }
        });

        this.zone.run(() => observer.next(modelRef));
    }

    private loadLibrary(): Promise<void> {
        return this.resources.loadLibrary('photoSwipe');
    }

    private init(): void {
        this.initialized = true;

        const div = document.createElement('div');

        div.innerHTML = template;

        this.element = div.firstElementChild as HTMLDivElement;

        document.body.appendChild(this.element);
    }
}
