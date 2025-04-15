import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenManagerService } from '@core/services/token-manager.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {
  constructor(
    private tokenManager: TokenManagerService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Unlogged users can access the route
    if (!this.tokenManager.getAccessToken() && !this.tokenManager.getRefreshToken()) {
      return true;
    }

    // Redirect logged users
    this.router.navigate(['/topics']);
    return false;
  }
}
