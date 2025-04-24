import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColorType } from '@shared/models/button.model';
import { Observable, of } from 'rxjs';
import { Topic } from 'src/app/features/topics/interfaces/topic.interface';

export type TopicCardMode = 'subscribe' | 'unsubscribe' | 'readonly';

@Component({
  selector: 'app-topic-card',
  templateUrl: './topic-card.component.html',
  styleUrls: ['./topic-card.component.scss']
})
export class TopicCardComponent {
  @Input() topic!: Topic;
  @Input() mode: TopicCardMode = 'readonly';
  @Output() subscribe = new EventEmitter<number>();
  @Output() unsubscribe = new EventEmitter<number>();

  get isLoading$(): Observable<boolean> {
    return of(!!this.topic.isLoading);
  }

  get buttonLabel(): string {
    if (this.topic.isLoading) return 'Chargement...';

    switch (this.mode) {
      case 'subscribe':
        return this.topic.isSubscribed ? 'Déjà abonné' : 'S\'abonner';
      case 'unsubscribe':
        return 'Se désabonner';
      default:
        return '';
    }
  }

  get buttonColor(): ColorType {
    if (this.mode === 'subscribe' && this.topic.isSubscribed) {
      return 'secondary';
    }
    // else if (this.mode === 'unsubscribe') {
    //   return 'warn';
    // }
    return 'primary';
  }

  get showButton(): boolean {
    return this.mode !== 'readonly';
  }

  get isButtonDisabled(): Observable<boolean> {
    return of(!!this.topic.isLoading || (this.mode === 'subscribe' && !!this.topic.isSubscribed));
  }

  onAction(): void {
    if (this.topic.isLoading) return;

    if (this.mode === 'subscribe' && !this.topic.isSubscribed) {
      this.subscribe.emit(this.topic.id);
    } else if (this.mode === 'unsubscribe') {
      this.unsubscribe.emit(this.topic.id);
    }
  }
}
