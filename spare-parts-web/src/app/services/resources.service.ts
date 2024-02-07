import { Injectable } from '@angular/core';

type Task = () => Promise<void>;

interface LibrariesDef {
    [name: string]: Task;
}

@Injectable({
    providedIn: 'root',
})
export class ResourcesService {
    private loaded: { [url: string]: Promise<void>; } = {};

    private libraries: LibrariesDef = {
        photoSwipe: ResourcesService.parallel(
            this.styleTask('assets/vendor/photoswipe/photoswipe.css'),
            this.styleTask('assets/vendor/photoswipe/default-skin/default-skin.css'),
            this.scriptTask('assets/vendor/photoswipe/photoswipe.min.js'),
            this.scriptTask('assets/vendor/photoswipe/photoswipe-ui-default.min.js'),
        ),
    };

    static series(...tasks: Task[]): Task {
        if (!tasks.length) {
            return () => Promise.resolve();
        }

        return () => tasks.shift()().then(ResourcesService.series(...tasks));
    }

    static parallel(...tasks: Task[]): Task {
        if (!tasks.length) {
            return () => Promise.resolve();
        }

        return () => Promise.all(tasks.map(task => task())).then(() => {});
    }

    constructor() { }

    loadScript(url: string): Promise<void> {
        return this.scriptTask(url)();
    }

    loadStyle(url: string): Promise<void> {
        return this.styleTask(url)();
    }

    loadLibrary(library: string): Promise<void> {
        return this.libraries[library]();
    }

    private scriptTask(url: string): Task {
        return () => {
            if (!this.loaded.hasOwnProperty(url)) {
                this.loaded[url] = new Promise<void>((resolve, reject) => {
                    const script = document.createElement('script');

                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Loading error: ' + url));
                    script.src = url;

                    document.head.appendChild(script);
                });
            }

            return this.loaded[url];
        };
    }

    private styleTask(url: string): Task {
        return () => {
            if (!this.loaded.hasOwnProperty(url)) {
                this.loaded[url] = new Promise<void>((resolve, reject) => {
                    const link = document.createElement('link');

                    link.onload = () => resolve();
                    link.onerror = () => reject(new Error('Loading error: ' + url));
                    link.type = 'text/css';
                    link.rel = 'stylesheet';
                    link.href = url;

                    document.head.appendChild(link);
                });
            }

            return this.loaded[url];
        };
    }
}
