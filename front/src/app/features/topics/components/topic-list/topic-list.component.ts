import { Component, OnInit } from '@angular/core';
import { Topic } from '../../interfaces/topic.interface';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from '@shared/services/alert.service';
import { Subscription } from '@core/interfaces/subscription.interface';
import { SubscriptionService } from '@core/services/subscription.service';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss'],
})
export class TopicListComponent implements OnInit {
  topics: Topic[] = [];
  isLoading$ = new BehaviorSubject<boolean>(true);
  errors$ = new BehaviorSubject<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.loadTopics();
  }

  onAction(topicId: number): void {
    const topic = this.findTopicById(topicId);
    if (!topic) return;
    topic.isLoading = true;

    if(!topic.isSubscribed) {
      this.subscriptionService
        .createSubscription(topic.id)
        .subscribe({
          next: () => {
            topic.isSubscribed = !topic.isSubscribed;
            topic.isLoading = false;
            this.alertService.success(
              `Vous êtes abonné au thème ${topic.name}.`
            );
          },
          error: (err) => {
            topic.isLoading = false;
            this.alertService.error(
              `Vous n'avez pas pu vous abonner au thème ${topic.name}. Veuillez réessayer plus tard.`
            );
          },
        });
    }

    // of(null)
    //   .pipe(delay(2000))
    //   .subscribe({
    //     next: () => {

    //       topic.isSubscribed = !topic.isSubscribed;
    //       topic.isLoading = false;
    //       this.alertService.success(
    //         `Vous êtes ${
    //           topic.isSubscribed ? 'abonné' : 'désabonné'
    //         } au thème ${topic.name}.`
    //       );
    //     },
    //     error: (err) => {
    //       topic.isLoading = false;
    //       this.alertService.error(
    //         `Vous n'avez pas pu vous ${
    //           topic.isSubscribed ? 'abonner' : 'désabonner'
    //         } au thème ${topic.name}. Veuillez réessayer plus tard.`
    //       );
    //     },
    //   });
  }

  private findTopicById(id: number): Topic | undefined {
    return this.topics.find((topic) => topic.id === id);
  }

  private loadTopics(): void {
    this.route.data.pipe(delay(1500)).subscribe((data) => {
      const fetchedData = data['topicsData'];

      if (!fetchedData) {
        this.isLoading$.next(false);
        this.errors$.next(
          'Erreur lors du chargement des thèmes. Veuillez réessayer plus tard.'
        );
        return;
      }

      this.errors$.next(null);
      const topics = fetchedData.topics;
      const subscriptions = fetchedData.subscriptions;

      this.topics = topics.map((topic: Topic) => ({
        ...topic,
        isSubscribed: subscriptions.some(
          (subscription: Subscription) => subscription.topicId === topic.id
        ),
        isLoading: false,
      }));

      this.isLoading$.next(false);
    });
  }
}
