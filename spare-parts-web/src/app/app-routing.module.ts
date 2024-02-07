import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { RootComponent } from './components/root/root.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { EmailVerifyComponent } from './email-verify/email-verify.component';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    data: {
      desktopHeader: 'spaceship/one',
      mobileHeader: 'one',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'shop',
        loadChildren: () =>
          import('./modules/shop/shop.module').then((m) => m.ShopModule),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./modules/account/account.module').then(
            (m) => m.AccountModule
          ),
      },
      {
        path: 'site',
        loadChildren: () =>
          import('./modules/site/site.module').then((m) => m.SiteModule),
      },
      {
        path: 'registration/verify-user',
        component: EmailVerifyComponent,
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'disabled',
      anchorScrolling: 'disabled',
      initialNavigation: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
