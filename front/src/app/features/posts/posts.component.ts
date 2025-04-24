import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Post } from './interfaces/post.interface';

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})

export class PostsComponent {
  title = 'Articles';
  sortDirection: 'asc' | 'desc' = 'asc';
  isDisabled$: Observable<boolean> = of(false);
  posts: Post[] = [];
  sortedPosts: Post[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  onAction(): void {
    this.router.navigate(['articles/create']);
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortPosts();
  }

  sortPosts() {
    this.sortedPosts = [...this.posts].sort((a, b) => {
      const dateA = new Date(a.creationDate).getTime();
      const dateB = new Date(b.creationDate).getTime();

      if (this.sortDirection === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }

  private loadPosts(): void {
    this.route.data.subscribe(data => {
      this.posts = (data['posts'] || []);
      this.sortPosts();
    });
  }
}
