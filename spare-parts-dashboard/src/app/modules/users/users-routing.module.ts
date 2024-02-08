import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersProfileComponent } from './users-profile/users-profile.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { SecureInnerPagesGuard } from 'src/app/shared/guard/SecureInnerPagesGuard.guard';
import { UsersProfileResolver } from '../../shared/resolver/users-profile.resolver';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [SecureInnerPagesGuard],
    children: [
      {
        path: 'view',
        component: UsersProfileComponent,
        data: {
          roles: ['Admin'],
          title: '',
          breadcrumb: 'All'
        },
        resolve: { usersProfile: UsersProfileResolver }
      },
      {
        path: 'add',
        component: UserAddComponent,
        data: {
          roles: ['Admin'],
          title: '',
          breadcrumb: 'Add'
        }
      },
      {
        path: 'edit',
        component: UserEditComponent,
        data: {
          roles: ['Admin'],
          title: '',
          breadcrumb: 'Edit'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
