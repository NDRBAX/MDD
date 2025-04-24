import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@core/interfaces/user.interface';
import { AlertService } from '@shared/services/alert.service';
import { BehaviorSubject, finalize, Observable, of } from 'rxjs';
import { UserService } from './services/user.service';
import { Topic } from '../topics/interfaces/topic.interface';
import { SubscriptionService } from '@core/services/subscription.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  title = 'Profil utilisateur';

  public updateProfileForm!: FormGroup;
  public hidePassword = true;
  private isSubmitting = false;
  user: User | null = null;
  topics: any[] = [];

  subscribedTopics: Topic[] = [];
  isLoading$ = new BehaviorSubject<boolean>(true);
  errors$ = new BehaviorSubject<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const profileData = data['profileData'];
      if (profileData) {
        this.user = profileData.user;
        this.subscribedTopics = profileData.topics;
      }

    });

    this.updateProfileForm = this.fb.group({
      username: [this.user?.username, [Validators.required]],
      email: [this.user?.email, [Validators.required]],
      password: ['', [Validators.minLength(6)]],
    });

    this.isLoading$.next(false);

  }

  public onSubmit(): void {
    if (this.updateProfileForm.invalid || !this.user) {
      return;
    }

    const formValue = this.updateProfileForm.value;
    const updateData: any = {};

    if (formValue.username !== this.user.username) {
      updateData.username = formValue.username;
    }

    if (formValue.email !== this.user.email) {
      updateData.email = formValue.email;
    }

    if (formValue.password) {
      updateData.password = formValue.password;
    }

    if (Object.keys(updateData).length === 0) {
      this.router.navigate(['/profile']);
      return;
    }

    this.isSubmitting = true;

    this.userService
      .updateCurrentUser(updateData)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          if (error.status === 409) {
            this.alertService.error(
              "Ce nom d'utilisateur ou cet email est déjà utilisé"
            );
          } else {
            this.alertService.error(
              'Une erreur est survenue lors de la mise à jour du profil'
            );
          }
        },
      });
  }

  get disableSubmitButton$(): Observable<boolean> {
    return of(this.isSubmitting);
  }

  public cancel(): void {
    this.router.navigate(['/profile']);
  }

  onUnsubscribe(topicId: number): void {
    const topic = this.findTopicById(topicId);
    if (!topic) return;

    topic.isLoading = true;

    this.subscriptionService.deleteSubscription(topicId)
      .subscribe({
        next: () => {
          this.subscribedTopics = this.subscribedTopics.filter(t => t.id !== topicId);
          this.alertService.success(`Vous êtes désabonné du thème ${topic.name}.`);
        },
        error: (err) => {
          topic.isLoading = false;
          this.alertService.error(
            `Vous n'avez pas pu vous désabonner du thème ${topic.name}. Veuillez réessayer plus tard.`
          );
        }
      });
  }

  private findTopicById(id: number): Topic | undefined {
    return this.subscribedTopics.find(topic => topic.id === id);
  }
}
