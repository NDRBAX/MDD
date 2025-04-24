import { RouterModule, Routes } from "@angular/router";

import { NgModule } from "@angular/core";
import { PostsComponent } from "./posts.component";
import { postsResolver } from "./resolvers/posts.resolver";

const routes: Routes = [
  {
    path: '',
    component: PostsComponent,
    resolve: {
      posts: postsResolver
    }
  },
  {
    path: 'create',
    loadChildren: () => import('./create-post/create-post.module').then(m => m.CreatePostsModule),
  },
  {
    path: ':id',
    loadChildren: () => import('./post-detail/post-detail.module').then(m => m.PostDetailModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
