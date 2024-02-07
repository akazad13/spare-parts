import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';

// components
import { RadioButtonComponent } from './components/radio-button/radio-button.component';
// directives
import { RadioGroupDirective } from './directives/radio-group.directive';


@NgModule({
    declarations: [
        // components
        RadioButtonComponent,
        // directives
        RadioGroupDirective,
    ],
    imports: [
        // modules (angular)
        CommonModule,
    ],
    exports: [
        // components
        RadioButtonComponent,
        // directives
        RadioGroupDirective,
    ],
})
export class RadioModule { }
