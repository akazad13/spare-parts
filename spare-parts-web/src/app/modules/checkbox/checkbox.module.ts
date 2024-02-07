import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
// components
import { CheckboxComponent } from './components/checkbox/checkbox.component';
// directives
import { CheckboxGroupDirective } from './directives/checkbox-group.directive';


@NgModule({
    declarations: [
        // components
        CheckboxComponent,
        // directives
        CheckboxGroupDirective,
    ],
    exports: [
        // components
        CheckboxComponent,
        // directives
        CheckboxGroupDirective,
    ],
    imports: [
        // modules (angular)
        CommonModule,
    ],
})
export class CheckboxModule { }
