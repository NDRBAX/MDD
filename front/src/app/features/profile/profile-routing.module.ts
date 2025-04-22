import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProfileComponent } from "./profile.component";
import { profileResolver } from "./resolvers/profile.resolver";

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    resolve: {
      profileData: profileResolver
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
