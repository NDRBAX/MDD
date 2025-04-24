import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Post } from '../../interfaces/post.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnChanges{
  @Input() posts: Post[] = [];
  isLoading$ = new BehaviorSubject<boolean>(true);
  errors$ = new BehaviorSubject<string | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['posts']) {
      this.isLoading$.next(false);
    }
  }
}
