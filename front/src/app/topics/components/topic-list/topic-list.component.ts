import { Component, OnInit } from '@angular/core';
import { Topic } from '../../models/topic.model';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent implements OnInit {
  topics: Topic[] = [];
  isLoading$ = new BehaviorSubject<boolean>(true);
  errors$ = new BehaviorSubject<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadTopics();
  }

  onAction(topicId: number): void {
    const topic = this.findTopicById(topicId);
    if (!topic) return;
    topic.isLoading = true;

    of(null).pipe(
      delay(2000)
    ).subscribe({
      next: () => {
        topic.isSubscribed = !topic.isSubscribed;
        topic.isLoading = false;
        this.alertService.success(`Vous êtes ${topic.isSubscribed ? 'abonné' : 'désabonné'} au thème ${topic.name}.`);
      },
      error: (err) => {
        topic.isLoading = false;
        this.alertService.error(`Vous n'avez pas pu vous ${topic.isSubscribed ? 'abonner' : 'désabonner'} au thème ${topic.name}. Veuillez réessayer plus tard.`);
      }
    });
  }

  private findTopicById(id: number): Topic | undefined {
    return this.topics.find(topic => topic.id === id);
  }

  private loadTopics(): void {
    this.route.data.pipe(delay(1500)).subscribe(data => {
        this.topics = (data['topics'] || []).map((topic: Topic) => ({
          ...topic,
          isSubscribed: false,
          isLoading: false
        }));

        this.isLoading$.next(false);

        if (this.topics.length === 0) {
          this.errors$.next('Erreur lors du chargement des thèmes. Veuillez réessayer plus tard.');
        } else {
          this.errors$.next(null);
        }
    });
  }
}
