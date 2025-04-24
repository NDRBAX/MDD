import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Topic } from '../interfaces/topic.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {
  constructor(private http: HttpClient) {}

  getAllTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${environment.apiTopics}`);
  }
}
