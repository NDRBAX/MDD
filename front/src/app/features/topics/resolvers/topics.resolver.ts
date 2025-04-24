import { inject } from "@angular/core";
import { TopicsService } from "../services/topics.service";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { catchError, forkJoin, map, Observable, of } from "rxjs";
import { SubscriptionService } from "@core/services/subscription.service";
import { UserTopicsData } from "../interfaces/user-topics.interface";

export const topicsResolver: ResolveFn<UserTopicsData | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<UserTopicsData | null> => {
  const topicsService = inject(TopicsService);
  const subscriptionService = inject(SubscriptionService)

  return forkJoin({
    topics: topicsService.getAllTopics(),
    subscriptions: subscriptionService.getUserSubscriptions()
  }).pipe(
    map((result) => ({
      topics: result.topics,
      subscriptions: result.subscriptions
    })),
    catchError(error => {
      console.error('', error);
      return of(null)
    })
  );
};
