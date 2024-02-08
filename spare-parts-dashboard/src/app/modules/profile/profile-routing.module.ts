import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { SecureInnerPagesGuard } from '../../shared/guard/SecureInnerPagesGuard.guard';
import { ProfileViewResolver } from '../../shared/resolver/profile-view.resolver';
import { ProfileChangePwdComponent } from './profile-change-pwd/profile-change-pwd.component';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [SecureInnerPagesGuard],
    children: [
      {
        path: 'view',
        component: ProfileViewComponent,
        data: {
          title: '',
          breadcrumb: 'All'
        },
        resolve: { userProfile: ProfileViewResolver }
      },
      {
        path: 'edit',
        component: ProfileEditComponent,
        data: {
          title: '',
          breadcrumb: 'Edit'
        },
        resolve: { userProfile: ProfileViewResolver }
      },
      {
        path: 'change-password',
        component: ProfileChangePwdComponent,
        data: {
          title: '',
          breadcrumb: 'Edit'
        },
        resolve: { userProfile: ProfileViewResolver }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
