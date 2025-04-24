import { RouterModule, Routes } from "@angular/router";
import { TopicsComponent } from "./topics.component";
import { topicsResolver } from "./resolvers/topics.resolver";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: TopicsComponent,
    resolve: {
      topics: topicsResolver
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicsRoutingModule { }
