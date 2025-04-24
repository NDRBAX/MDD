import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { UnauthGuard } from '@core/guards/unauth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'articles',
    loadChildren: () =>
      import('./features/posts/posts.module').then((m) => m.PostsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [UnauthGuard],
  },
  {
    path: 'topics',
    loadChildren: () =>
      import('./features/topics/topics.module').then((m) => m.TopicsModule),
    canActivate: [AuthGuard],
  },
  { path: '', component: HomeComponent, canActivate: [UnauthGuard] },
  // Wildcard route -> 404
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
