import { Component, HostBinding, Input } from '@angular/core';

export type PostCardLayout = 'list' | 'grid' | 'grid-sm';

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent {
    @Input() post;

    @Input() layout: PostCardLayout;

    @HostBinding('class.post-card') classPostCard = true;

    @HostBinding('class.post-card--layout--list') get classPostCardLayoutList(): boolean {
        return this.layout === 'list';
    }

    @HostBinding('class.post-card--layout--grid') get classPostCardLayoutGrid(): boolean {
        return this.layout === 'grid';
    }

    @HostBinding('class.post-card--layout--grid-sm') get classPostCardLayoutGridSm(): boolean {
        return this.layout === 'grid-sm';
    }

    constructor() { }
}
