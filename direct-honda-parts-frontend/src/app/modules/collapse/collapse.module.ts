import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';

// directives
import { CollapseContentDirective } from './directives/collapse-content.directive';
import { CollapseItemDirective } from './directives/collapse-item.directive';

@NgModule({
    declarations: [
        // directives
        CollapseContentDirective,
        CollapseItemDirective,
    ],
    exports: [
        // directives
        CollapseContentDirective,
        CollapseItemDirective,
    ],
    imports: [
        // modules (angular)
        CommonModule,
    ],
})
export class CollapseModule { }
