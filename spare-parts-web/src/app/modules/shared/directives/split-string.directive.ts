import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[appSplitString]',
    exportAs: 'splitString',
})
export class SplitStringDirective {
    private parts: string[] = [];

    @Input() set appSplitString(value: string) {
        this.parts = value.split('|');
    }

    constructor() { }

    getPart(index: number): string {
        return this.parts[index];
    }
}
