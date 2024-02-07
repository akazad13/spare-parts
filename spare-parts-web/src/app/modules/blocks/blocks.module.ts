import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// modules (third-party)
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';
// modules
import { SharedModule } from '../shared/shared.module';

// blocks
import { BlockBannersComponent } from './block-banners/block-banners.component';
import { BlockBrandsComponent } from './block-brands/block-brands.component';
import { BlockCategoriesComponent } from './block-categories/block-categories.component';
import { BlockFeaturesComponent } from './block-features/block-features.component';
import { BlockFinderComponent } from './block-finder/block-finder.component';
import { BlockPostsCarouselComponent } from './block-posts-carousel/block-posts-carousel.component';
import { BlockProductsCarouselComponent } from './block-products-carousel/block-products-carousel.component';
import { BlockProductsColumnsComponent } from './block-products-columns/block-products-columns.component';
import { BlockSaleComponent } from './block-sale/block-sale.component';
import { BlockSlideshowComponent } from './block-slideshow/block-slideshow.component';
import { BlockZoneComponent } from './block-zone/block-zone.component';
import { BlockVinComponent } from './block-vin/block-vin.component';

@NgModule({
  declarations: [
    // blocks
    BlockBannersComponent,
    BlockBrandsComponent,
    BlockCategoriesComponent,
    BlockFeaturesComponent,
    BlockFinderComponent,
    BlockPostsCarouselComponent,
    BlockProductsCarouselComponent,
    BlockProductsColumnsComponent,
    BlockSaleComponent,
    BlockSlideshowComponent,
    BlockZoneComponent,
    BlockVinComponent
  ],
  exports: [
    // blocks
    BlockBannersComponent,
    BlockBrandsComponent,
    BlockCategoriesComponent,
    BlockFeaturesComponent,
    BlockFinderComponent,
    BlockPostsCarouselComponent,
    BlockProductsCarouselComponent,
    BlockProductsColumnsComponent,
    BlockSaleComponent,
    BlockSlideshowComponent,
    BlockZoneComponent
  ],
  imports: [
    // modules (angular)
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // modules (third-party)
    CarouselModule,
    TranslateModule.forChild(),
    // modules
    SharedModule
  ]
})
export class BlocksModule {}
