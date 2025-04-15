import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenManagerService } from '@core/services/token-manager.service';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private tokenManager: TokenManagerService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean| Observable<boolean> {
    const accessToken = this.tokenManager.getAccessToken();

    if (!accessToken) {
      const refreshToken = this.tokenManager.getRefreshToken();

      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          map(() => {
            return true;
          }),
          catchError(() => {
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: state.url }
            });
            return of(false);
          })
        );
      } else {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    }
    return true;
  }
}
