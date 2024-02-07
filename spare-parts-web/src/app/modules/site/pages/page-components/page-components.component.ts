import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
    selector: 'app-page-components',
    templateUrl: './page-components.component.html',
    styleUrls: ['./page-components.component.scss'],
})
export class PageComponentsComponent {
    inputNumber: UntypedFormControl = new UntypedFormControl(3);

    constructor() { }
}
