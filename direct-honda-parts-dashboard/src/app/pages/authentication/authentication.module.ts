import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UnlockUserComponent } from './unlock-user/unlock-user.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { ForgetPwdComponent } from './forget-pwd/forget-pwd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    UnlockUserComponent,
    ResetPwdComponent,
    ForgetPwdComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    SharedModule
  ]
})
export class AuthenticationModule {}
