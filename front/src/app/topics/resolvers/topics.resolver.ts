import { inject } from "@angular/core";
import { TopicsService } from "../services/topics.service";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Topic } from "../models/topic.model";
import { catchError, Observable, of } from "rxjs";

export const topicsResolver: ResolveFn<Topic[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<Topic[]> => {
  const topicsService = inject(TopicsService);
  return topicsService.getAllTopics().pipe(
    catchError(error => {
      console.error('Error loading topics', error);
      return of([]);
    })
  );
};
