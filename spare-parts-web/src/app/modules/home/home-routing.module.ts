import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// pages
import { HomepageComponent } from './pages/homepage/homepage.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomepageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
