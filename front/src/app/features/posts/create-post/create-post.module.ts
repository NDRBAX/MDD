import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { CreatePostComponent } from './create-post.component';
import { CreatePostRoutingModule } from './create-post-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, CreatePostRoutingModule, SharedModule, ReactiveFormsModule],
  declarations: [CreatePostComponent],
  exports: [],
})
export class CreatePostsModule {}
