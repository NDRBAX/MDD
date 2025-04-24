import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { AlertService } from '@shared/services/alert.service';
import { CommentsService } from '../../services/comments.service';
import { CommentRequest } from '../../interfaces/comment-request.interface';
import { Comment } from '../../interfaces/comment.interface';

@Component({
  selector: 'app-post-comment-list',
  templateUrl: './post-comment-list.component.html',
  styleUrls: ['./post-comment-list.component.scss']
})
export class PostCommentListComponent implements OnInit {
  @Input() postId!: number;
  @Input() comments: Comment[] = [];
  @Output() commentAdded = new EventEmitter<Comment>();

  commentForm!: FormGroup;
  isSubmitting$ = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]]
    });
  }


  submitComment(): void {
    if (this.commentForm.invalid) return;

    this.isSubmitting$.next(true);

    const commentRequest: CommentRequest = {
      postId: this.postId,
      content: this.commentForm.value.comment
    };

    this.commentsService.createComment(commentRequest).subscribe({
      next: (newComment) => {
        this.commentAdded.emit(newComment);

        this.commentForm.reset();
        this.commentForm.get('comment')?.setErrors(null);
        this.commentForm.markAsPristine();
        this.commentForm.markAsUntouched();

        this.alertService.success('Votre commentaire a été publié');
        this.isSubmitting$.next(false);
      },
      error: (error) => {
        this.alertService.error('Une erreur est survenue lors de la publication du commentaire');
        this.isSubmitting$.next(false);
      }
    });
  }
}
