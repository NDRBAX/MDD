import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';
import { PostsService } from '../services/posts.service';
import { AlertService } from '@shared/services/alert.service';
import { Topic } from '../../topics/interfaces/topic.interface';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  postForm!: FormGroup;
  topics: Topic[] = [];
  isLoading$ = new BehaviorSubject<boolean>(false);
  isSubmitting$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private postsService: PostsService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTopics();
  }

  initForm(): void {
    this.postForm = this.fb.group({
      topicId: ['', Validators.required],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      content: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  loadTopics(): void {
    this.isLoading$.next(true);
    this.route.data.subscribe({
      next: (data) => {
        this.topics = data['topics'];
        this.isLoading$.next(false);
      },
      error: (error) => {
        this.isLoading$.next(false);
        this.error$.next('Erreur lors du chargement des thèmes');
        console.error('Error loading topics', error);
      },
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    this.isSubmitting$.next(true);

    this.postsService
      .createPost(this.postForm.value)
      .pipe(finalize(() => this.isSubmitting$.next(false)))
      .subscribe({
        next: (post) => {
          this.alertService.success('Article créé avec succès');
          this.router.navigate(['/articles', post.id]);
        },
        error: (error) => {
          this.alertService.error(
            "Une erreur est survenue lors de la création de l'article"
          );
          console.error('Error creating post', error);
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/articles']);
  }
}
