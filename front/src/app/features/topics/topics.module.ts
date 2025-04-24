import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicListComponent } from './components/topic-list/topic-list.component';

import { SharedModule } from '@shared/shared.module';

import { TopicsRoutingModule } from './topics-routing.module';
import { TopicsComponent } from './topics.component';

@NgModule({
  imports: [
    CommonModule,
    TopicsRoutingModule,
    SharedModule
  ],
  declarations: [
    TopicListComponent,
    TopicsComponent
  ]
})
export class TopicsModule { }
