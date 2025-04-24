import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Topic } from '../../models/topic.model';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Component({
  selector: 'app-topic-item',
  templateUrl: './topic-item.component.html',
  styleUrls: ['./topic-item.component.scss']
})
export class TopicItemComponent {
  @Input() topic!: Topic;
  @Output() action = new EventEmitter<number>();
  private _isLoading = new BehaviorSubject<boolean>(false);

  get isLoading$(): Observable<boolean> {
    return of(!!this.topic.isLoading);
  }

  onAction(): void {
    if (this._isLoading.value) return;
    this.action.emit(this.topic.id);
  }
}
