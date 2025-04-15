import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public signinForm: FormGroup;
  public hidePassword = true;
  private isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.signinForm = this.fb.group({
      identifier : ['admin_2@mdd.com', Validators.required],
      password: ['Password!123', Validators.required]
    });
  }

  public onSubmit(): void {
    if (this.signinForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      this.authService.login(this.signinForm.value).subscribe({
        next: (response) => {
          console.log('User logged in successfully', response);
          this.isSubmitting = false;
          this.router.navigate(['/topics']);
        },
        error: (error) => {
          console.error('Error logging in user', error);
          this.isSubmitting = false;
          this.alertService.error('Erreur de connexion. Veuillez vérifier vos identifiants.');
        }
      });
    }
  }

  get disableSubmitButton$(): Observable<boolean> {
    return of(this.signinForm.invalid || this.isSubmitting);
  }

  public onBack(): void {
    this.router.navigate(['/']);
  }
}
