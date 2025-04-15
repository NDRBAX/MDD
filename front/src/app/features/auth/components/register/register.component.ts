import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { passwordValidator } from '../../validators/password.validator';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  signupForm: FormGroup;
  hidePassword = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService

  ) {
    this.signupForm = this.fb.group({
      username: ['admin_2', Validators.required],
      email: ['admin_2@mdd.com', [Validators.required, Validators.email]],
      password: ['Password!123', [Validators.required, passwordValidator()]],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      this.authService.register(this.signupForm.value).subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          this.isSubmitting = false;
          this.router.navigate(['/topics']);
          this.alertService.success(
            `Bienvenue ${response.user.username}, vous êtes maintenant inscrit et connecté !`
          );
        },
        error: (error) => {
          console.error('Error registering user', error);
          this.isSubmitting = false;
          this.alertService.error(
            `Erreur d\'inscription. ${error.error.message} Veuillez vérifier vos informations.`
          );
        },
      });
    }
  }

  get disableSubmitButton$(): Observable<boolean> {
    return of(this.signupForm.invalid || this.isSubmitting);
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  getPasswordErrorMessage(): string {
    const passwordErrors =
      this.signupForm.controls['password'].errors?.['invalidPassword'];

    if (!passwordErrors) {
      return '';
    }

    const errorChecks = [
      { check: 'isValidLength', message: 'au moins 8 caractères' },
      { check: 'hasUpperCase', message: 'une lettre majuscule' },
      { check: 'hasLowerCase', message: 'une lettre minuscule' },
      { check: 'hasNumeric', message: 'un chiffre' },
      { check: 'hasSpecialChar', message: 'un caractère spécial (@#$%^&+=!)' },
      { check: 'hasNoWhitespace', message: 'aucun espace' },
    ];

    const errorMessages = errorChecks
      .filter((item) => !passwordErrors[item.check])
      .map((item) => item.message);

    if (errorMessages.length === 0) {
      return '';
    }

    return 'Le mot de passe doit contenir ' + errorMessages.join(', ') + '.';
  }
}
