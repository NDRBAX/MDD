import { inject } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn,
} from '@angular/router';
import { Observable, of, catchError, forkJoin, map } from 'rxjs';
import { UserService } from '../services/user.service';

import { UserProfileData } from '../interfaces/user-profile-data';
import { SubscriptionService } from '@core/services/subscription.service';
import { TopicsService } from '../../topics/services/topics.service';

export const profileResolver: ResolveFn<UserProfileData | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<UserProfileData | null> => {
  const userService = inject(UserService);
  const topicsService = inject(TopicsService);
  const subscriptionService = inject(SubscriptionService);

  return forkJoin({
    user: userService.getCurrentUser(),
    subscriptions: subscriptionService.getUserSubscriptions(),
    topics: topicsService.getAllTopics(),
  }).pipe(
    map((result) => ({
      user: result.user,
      topics: result.topics.filter((topic) =>
        result.subscriptions.some(
          (subscription) => subscription.topicId === topic.id
        )
      ),
    })),
    catchError((error) => {
      console.error('Erreur lors du chargement des données du profil:', error);
      return of(null);
    })
  );
};
