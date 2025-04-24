import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../interfaces/post.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent {
  @Input() post!: Post;
  @Output() action = new EventEmitter<number>();

  constructor(private router: Router) {}

  navigateToPostDetail(): void {
    this.router.navigate(['/articles', this.post.id]);
  }

}
