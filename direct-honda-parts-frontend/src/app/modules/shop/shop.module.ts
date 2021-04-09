import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// modules (third-party)
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSliderModule } from '@m0t0r/ngx-slider';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
// modules
import { BlocksModule } from '../blocks/blocks.module';
import { CollapseModule } from '../collapse';
import { RadioModule } from '../radio/radio.module';
import { SharedModule } from '../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';

// components
import { AnalogsTableComponent } from './components/analogs-table/analogs-table.component';
import { ProductSidebarComponent } from './components/product-sidebar/product-sidebar.component';
import { ProductsViewComponent } from './components/products-view/products-view.component';
import { ProductTabComponent } from './components/product-tab/product-tab.component';
import { ProductTabsComponent } from './components/product-tabs/product-tabs.component';
import { ReviewsListComponent } from './components/reviews-list/reviews-list.component';
import { ReviewsViewComponent } from './components/reviews-view/reviews-view.component';
import { ShopSidebarComponent } from './components/shop-sidebar/shop-sidebar.component';
import { SpecComponent } from './components/spec/spec.component';

// pages
import { PageCartComponent } from './pages/page-cart/page-cart.component';
import { PageCategoryComponent } from './pages/page-category/page-category.component';
import { PageCheckoutComponent } from './pages/page-checkout/page-checkout.component';
import { PageCompareComponent } from './pages/page-compare/page-compare.component';
import { PageOrderSuccessComponent } from './pages/page-order-success/page-order-success.component';
import { PageProductComponent } from './pages/page-product/page-product.component';
import { PageShopComponent } from './pages/page-shop/page-shop.component';
import { PageTrackOrderComponent } from './pages/page-track-order/page-track-order.component';
import { PageWishlistComponent } from './pages/page-wishlist/page-wishlist.component';

// widgets
import { WidgetCategoriesListComponent } from './widgets/widget-categories-list/widget-categories-list.component';
import { WidgetFiltersComponent } from './widgets/widget-filters/widget-filters.component';

// filters
import { FilterCategoryComponent } from './filters/filter-category/filter-category.component';
import { FilterVehicleComponent } from './filters/filter-vehicle/filter-vehicle.component';

@NgModule({
  declarations: [
    // components
    AnalogsTableComponent,
    ProductSidebarComponent,
    ProductsViewComponent,
    ProductTabComponent,
    ProductTabsComponent,
    ReviewsListComponent,
    ReviewsViewComponent,
    ShopSidebarComponent,
    SpecComponent,
    // pages
    PageCartComponent,
    PageCategoryComponent,
    PageCheckoutComponent,
    PageCompareComponent,
    PageOrderSuccessComponent,
    PageProductComponent,
    PageShopComponent,
    PageTrackOrderComponent,
    PageWishlistComponent,
    // widgets
    WidgetCategoriesListComponent,
    WidgetFiltersComponent,
    // filters
    FilterCategoryComponent,
    FilterVehicleComponent
  ],
  imports: [
    // modules (angular)
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // modules (third-party)
    CarouselModule,
    NgxPayPalModule,
    NgxSliderModule,
    TranslateModule.forChild(),
    AccordionModule.forRoot(),
    // modules
    BlocksModule,
    CollapseModule,
    RadioModule,
    SharedModule,
    ShopRoutingModule
  ]
})
export class ShopModule {}
