import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
// resolvers
import { CategoryResolver } from './resolvers/category.resolver';
import { ProductResolver } from './resolvers/product.resolver';
import { ProductsListResolver } from './resolvers/products-list.resolver';
import { RootCategoriesResolver } from './resolvers/root-categories.resolver';
// guards
import { CheckoutGuard } from './guards/checkout.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'category'
  },
  {
    path: 'category',
    component: PageCategoryComponent,
    resolve: {
      children: RootCategoriesResolver
    }
  },
  {
    path: 'category/products',
    component: PageShopComponent,
    resolve: {
      productsList: ProductsListResolver
    },
    data: {
      layout: 'grid',
      gridLayout: 'grid-4-sidebar',
      sidebarPosition: 'start'
    }
  },
  {
    path: 'category/:categorySlug/products',
    component: PageShopComponent,
    resolve: {
      category: CategoryResolver,
      productsList: ProductsListResolver
    },
    data: {
      layout: 'grid',
      gridLayout: 'grid-4-sidebar',
      sidebarPosition: 'start'
    }
  },
  {
    path: 'products/:productSlug',
    component: PageProductComponent,
    resolve: {
      product: ProductResolver
    },
    data: {
      layout: 'full',
      sidebarPosition: 'start'
    }
  },
  {
    path: 'cart',
    component: PageCartComponent
  },
  {
    path: 'checkout',
    pathMatch: 'full',
    component: PageCheckoutComponent,
    canActivate: [CheckoutGuard]
  },
  {
    path: 'checkout/:orderToken',
    component: PageOrderSuccessComponent
  },
  {
    path: 'wishlist',
    component: PageWishlistComponent
  },
  {
    path: 'compare',
    component: PageCompareComponent
  },
  {
    path: 'track-order',
    component: PageTrackOrderComponent
  },
  // The following routes are only for demonstrating possible page layouts.
  {
    path: 'order-success',
    component: PageOrderSuccessComponent,
    data: {
      orderToken: 'b84486c31644eac99f6909a6e8c19101'
    }
  },
  // shop
  ...[
    'grid-3-sidebar',
    'grid-4-sidebar',
    'grid-4-full',
    'grid-5-full',
    'grid-6-full'
  ].map((gridLayout) => ({
    path: `shop-${gridLayout}`,
    component: PageShopComponent,
    resolve: {
      category: CategoryResolver,
      productsList: ProductsListResolver
    },
    data: {
      layout: 'grid',
      gridLayout,
      sidebarPosition: 'start',
      categorySlug: 'headlights-lighting'
    }
  })),
  {
    path: `shop-list`,
    component: PageShopComponent,
    resolve: {
      category: CategoryResolver,
      productsList: ProductsListResolver
    },
    data: {
      layout: 'list',
      gridLayout: 'grid-4-sidebar',
      sidebarPosition: 'start',
      categorySlug: 'headlights-lighting'
    }
  },
  {
    path: `shop-table`,
    component: PageShopComponent,
    resolve: {
      category: CategoryResolver,
      productsList: ProductsListResolver
    },
    data: {
      layout: 'table',
      gridLayout: 'grid-4-sidebar',
      sidebarPosition: 'start',
      categorySlug: 'headlights-lighting'
    }
  },
  {
    path: `shop-right-sidebar`,
    component: PageShopComponent,
    resolve: {
      category: CategoryResolver,
      productsList: ProductsListResolver
    },
    data: {
      layout: 'grid',
      gridLayout: 'grid-4-sidebar',
      sidebarPosition: 'end',
      categorySlug: 'headlights-lighting'
    }
  },
  // product
  {
    path: 'product-full',
    component: PageProductComponent,
    resolve: {
      product: ProductResolver
    },
    data: {
      layout: 'full',
      sidebarPosition: 'start',
      productSlug: 'brandix-brake-kit-bdx-750z370-s'
    }
  },
  {
    path: 'product-sidebar',
    component: PageProductComponent,
    resolve: {
      product: ProductResolver
    },
    data: {
      layout: 'sidebar',
      sidebarPosition: 'start',
      productSlug: 'brandix-brake-kit-bdx-750z370-s'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CategoryResolver,
    ProductResolver,
    ProductsListResolver,
    RootCategoriesResolver
  ]
})
export class ShopRoutingModule {}
