import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicListComponent } from './components/topic-list/topic-list.component';
import { TopicsComponent } from './topics.component';
import { TopicsRoutingModule } from './topics-routing.module';
import { SharedModule } from '@shared/shared.module';
import { TopicItemComponent } from './components/topic-item/topic-item.component';



@NgModule({
  imports: [
    CommonModule,
    TopicsRoutingModule,
    SharedModule
  ],
  declarations: [
    TopicItemComponent,
    TopicListComponent,
    TopicsComponent
  ]
})
export class TopicsModule { }
