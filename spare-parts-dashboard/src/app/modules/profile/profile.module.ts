import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileViewResolver } from '../../shared/resolver/profile-view.resolver';
import { ProfileChangePwdComponent } from './profile-change-pwd/profile-change-pwd.component';

@NgModule({
  declarations: [ProfileEditComponent, ProfileViewComponent, ProfileChangePwdComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ProfileViewResolver]
})
export class ProfileModule {}
