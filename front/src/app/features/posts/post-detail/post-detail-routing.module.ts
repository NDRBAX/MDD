import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostDetailComponent } from './post-detail.component';
import { postDetailResolver } from './resolvers/post-detail.resolver';


const routes: Routes = [
  {
    path: '',
    component: PostDetailComponent,
    resolve: {
      post: postDetailResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostDetailRoutingModule { }
