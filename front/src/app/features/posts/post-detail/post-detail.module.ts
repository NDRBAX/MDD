import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostDetailRoutingModule } from './post-detail-routing.module';
import { PostDetailComponent } from './post-detail.component';

import { SharedModule } from '../../../shared/shared.module';
import { PostCommentListComponent } from './components/post-comment-list/post-comment-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostsModule } from '../posts.module';

@NgModule({
  declarations: [
    PostDetailComponent,
    PostCommentListComponent,

  ],
  imports: [
    CommonModule,
    PostDetailRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    PostsModule,
  ]
})
export class PostDetailModule { }
