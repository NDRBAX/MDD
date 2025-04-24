import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { PostDetailData } from './interfaces/post-detail.interface';
import { Comment } from './interfaces/comment.interface';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  post: PostDetailData | null = null;
  isLoading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.loadPost();
  }

  goBack(): void {
    this.router.navigate(['/articles']);
  }

  private loadPost(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.post = data['post'];

        if (this.post) {
          this.titleService.setTitle(`${this.post.title} | MDD`);
          this.metaService.updateTag({
            name: 'description',
            content: this.truncateContent(this.post.content, 150),
          });
          this.isLoading$.next(false);
        } else {
          this.error$.next('Article non trouvé');
          this.isLoading$.next(false);
        }
      },
      error: (err) => {
        this.error$.next(
          "Une erreur est survenue lors du chargement de l'article"
        );
        this.isLoading$.next(false);
      },
    });
  }

  private truncateContent(content: string, maxLength: number): string {
    return content.length > maxLength
      ? content.substring(0, maxLength - 3) + '...'
      : content;
  }

  onCommentAdded(newComment: Comment): void {
    if (this.post) {
      this.post.comments = [...this.post.comments, newComment];
    }
  }
}
