import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Post } from "../interfaces/post.interface";
import { environment } from "@env/environment";
import { PostDetailData } from "../post-detail/interfaces/post-detail.interface";
import { PostRequest } from "../create-post/interfaces/post-request.interface";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiPosts}/feed`)
  }

  getPostById(id: string): Observable<PostDetailData> {
    return this.http.get<PostDetailData>(`${environment.apiPosts}/${id}`);
  }

  createPost(postRequest: PostRequest): Observable<Post> {
    return this.http.post<Post>(`${environment.apiPosts}`, postRequest);
  }
}
