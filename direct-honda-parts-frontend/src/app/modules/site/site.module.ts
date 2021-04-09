import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// modules (third-party)
import { CarouselModule } from 'ngx-owl-carousel-o';
// modules
import { SharedModule } from '../shared/shared.module';
import { SiteRoutingModule } from './site-routing.module';

// pages
import { PageAboutUsComponent } from './pages/page-about-us/page-about-us.component';
import { PageComponentsComponent } from './pages/page-components/page-components.component';
import { PageContactUsOneComponent } from './pages/page-contact-us-one/page-contact-us-one.component';
import { PageContactUsTwoComponent } from './pages/page-contact-us-two/page-contact-us-two.component';
import { PageFaqComponent } from './pages/page-faq/page-faq.component';
import { PageTermsComponent } from './pages/page-terms/page-terms.component';
import { PageTypographyComponent } from './pages/page-typography/page-typography.component';

// blocks
import { BlockMapComponent } from './blocks/block-map/block-map.component';
import { BlockReviewsComponent } from './blocks/block-reviews/block-reviews.component';
import { BlockTeammatesComponent } from './blocks/block-teammates/block-teammates.component';


@NgModule({
    declarations: [
        // pages
        PageAboutUsComponent,
        PageComponentsComponent,
        PageContactUsOneComponent,
        PageContactUsTwoComponent,
        PageFaqComponent,
        PageTermsComponent,
        PageTypographyComponent,
        // blocks
        BlockMapComponent,
        BlockReviewsComponent,
        BlockTeammatesComponent,
    ],
    imports: [
        // modules (angular)
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // modules (third-party)
        CarouselModule,
        // modules
        SharedModule,
        SiteRoutingModule,
    ],
})
export class SiteModule { }
