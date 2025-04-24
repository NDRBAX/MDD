import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostHeaderComponent } from './components/post-header/post-header.component';

@NgModule({
  imports: [CommonModule, PostsRoutingModule, SharedModule],
  declarations: [PostsComponent, PostItemComponent, PostListComponent, PostHeaderComponent],
  exports: [PostHeaderComponent],
})
export class PostsModule {}
