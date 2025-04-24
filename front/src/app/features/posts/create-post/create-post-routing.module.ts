import { RouterModule, Routes } from "@angular/router";

import { NgModule } from "@angular/core";
import { CreatePostComponent } from "./create-post.component";
import { topicsResolver } from "./resolvers/topics.resolver";



const routes: Routes = [
  {
    path: '',
    component: CreatePostComponent,
    resolve: {
      topics: topicsResolver
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatePostRoutingModule { }
