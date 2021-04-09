import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
})
export class RatingComponent {
    @Input() value = 0;

    @HostBinding('class.rating') classRating = true;

    constructor() { }
}
