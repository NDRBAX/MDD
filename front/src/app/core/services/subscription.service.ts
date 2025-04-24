import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Subscription } from '@core/interfaces/subscription.interface';
import { SubscriptionRequest } from '@core/interfaces/subscription-request.interface';



@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly apiUrl = `${environment.apiSubscriptions}`;

  private subscriptionsSubject = new BehaviorSubject<Subscription[]>([]);
  public subscriptions$ = this.subscriptionsSubject.asObservable();

  constructor(private http: HttpClient) {}


  public getUserSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl)
      .pipe(
        tap(subscriptions => {
          this.subscriptionsSubject.next(subscriptions);
        })
      );
  }


  public createSubscription(topicId: number): Observable<void> {
    const subscriptionRequest: SubscriptionRequest = {
      topicId: topicId
    };

    return this.http.post<void>(this.apiUrl, subscriptionRequest)
      .pipe(
        tap(() => {
          this.getUserSubscriptions().subscribe();
        })
      );
  }


  public deleteSubscription(topicId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/topic/${topicId}`)
      .pipe(
        tap(() => {
          const currentSubscriptions = this.subscriptionsSubject.value;
          const updatedSubscriptions = currentSubscriptions.filter(
            subscription => {
              return subscription.topicId !== topicId;
            }
          );
          this.subscriptionsSubject.next(updatedSubscriptions);
        })
      );
  }


  public isSubscribed(topicId: number): boolean {
    const subscriptions = this.subscriptionsSubject.value;
    return subscriptions.some(sub => sub.id === topicId || sub.topic === String(topicId));
  }


  public ensureSubscriptionsLoaded(): Observable<Subscription[]> {
    if (this.subscriptionsSubject.value.length === 0) {
      return this.getUserSubscriptions();
    } else {
      return this.subscriptions$;
    }
  }
}
