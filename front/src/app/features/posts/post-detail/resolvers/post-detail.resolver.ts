import { inject } from "@angular/core";

import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from "@angular/router";

import { catchError, Observable, of } from "rxjs";
import { Post } from "../../interfaces/post.interface";
import { PostsService } from "../../services/posts.service";
import { AlertService } from "@shared/services/alert.service";
import { PostDetailData } from "../interfaces/post-detail.interface";


export const postDetailResolver: ResolveFn<PostDetailData | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<PostDetailData | null> => {
  const router = inject(Router);
  const postsService = inject(PostsService);
  const alertService = inject(AlertService);

  const postId = route.paramMap.get('id');

  if (!postId) {
    router.navigate(['/articles']);
    return of(null);
  }

  return postsService.getPostById(postId).pipe(
    catchError(error => {
      console.error('Error loading posts', error);
      router.navigate(['/articles']);
      alertService.error('Une erreur est survenue lors du chargement de l\'article');
      return of(null);
    })

  );
};
