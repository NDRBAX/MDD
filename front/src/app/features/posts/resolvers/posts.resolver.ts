import { inject } from "@angular/core";

import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { catchError, Observable, of } from "rxjs";
import { Post } from "../interfaces/post.interface";
import { PostsService } from "../services/posts.service";

export const postsResolver: ResolveFn<Post[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<Post[]> => {
  const postsService = inject(PostsService);
  return postsService.getAllPosts().pipe(
    catchError(error => {
      console.error('Error loading posts', error);
      return of([]);
    })
  );
};
