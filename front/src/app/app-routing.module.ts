import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'topics',
    loadChildren: () =>
      import('./topics/topics.module').then((m) => m.TopicsModule),
  },
  { path: '', component: HomeComponent },
  {
    path: '**',
    redirectTo: '',
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
