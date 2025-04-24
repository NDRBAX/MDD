import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Comment } from '../interfaces/comment.interface';
import { environment } from '@env/environment';
import { CommentRequest } from '../interfaces/comment-request.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly apiUrl = `${environment.apiComments}`;
  private commentsCache = new Map<number, Comment[]>();
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  public comments$ = this.commentsSubject.asObservable();

  constructor(private http: HttpClient) {}


  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`)
      .pipe(
        tap(comments => {
          this.commentsCache.set(postId, comments);
          this.commentsSubject.next(comments);
        })
      );
  }

  createComment(comment: CommentRequest): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment)
      .pipe(
        tap(newComment => {
          const postId = comment.postId;
          const currentComments = this.commentsCache.get(postId) || [];
          const updatedComments = [newComment, ...currentComments];

          this.commentsCache.set(postId, updatedComments);
          this.commentsSubject.next(updatedComments);
        })
      );
  }

  areCommentsLoaded(postId: number): boolean {
    return this.commentsCache.has(postId);
  }


  refreshComments(postId: number): Observable<Comment[]> {
    return this.getCommentsByPostId(postId);
  }
}
