import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UnlockUserComponent } from './unlock-user/unlock-user.component';
import { ForgetPwdComponent } from './forget-pwd/forget-pwd.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { SecureInnerPagesGuard } from '../../shared/guard/SecureInnerPagesGuard.guard';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'unlockuser',
        component: UnlockUserComponent
      },
      {
        path: 'forget-password',
        component: ForgetPwdComponent
      },
      {
        path: 'reset-password',
        component: ResetPwdComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SecureInnerPagesGuard]
})
export class AuthenticationRoutingModule {}
