import { inject } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn,
} from '@angular/router';
import { Observable, of, catchError, forkJoin, map } from 'rxjs';
import { Topic } from 'src/app/features/topics/interfaces/topic.interface';
import { TopicsService } from 'src/app/features/topics/services/topics.service';

export const topicsResolver: ResolveFn<Topic[] | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<Topic[] | null> => {
  const topicsService = inject(TopicsService);

  return topicsService.getAllTopics().pipe(
    map((result) => result),
    catchError((error) => {
      console.error('Erreur lors du chargement des données du profil:', error);
      return of(null);
    })
  );
};
