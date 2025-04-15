import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { TokenManagerService } from '@core/services/token-manager.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private tokenManager: TokenManagerService,
    private authService: AuthService,
    private router: Router
  ) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // don't intercept auth requests
    if (this.isAuthEndpoint(request.url)) {
      return next.handle(request);
    }

    const token = this.tokenManager.getAccessToken();
    if (token) {
      // Add the access token to the request if it exists
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.error('Error in interceptor', error.status);
          return this.handleTokenRefresh(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    const authEndpoints = [
      `${environment.apiAuth}/login`,
      `${environment.apiAuth}/register`,
      `${environment.apiAuth}/refresh-token`
    ];
    return authEndpoints.some(authEndpoint => url.includes(authEndpoint));
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handleTokenRefresh(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenManager.getRefreshToken();
      console.error('Refresh token:', refreshToken);

      if (!refreshToken) {
        this.isRefreshing = false;
        this.authService.logout().subscribe();
        return throwError(() => new Error('Refresh token not found'));
      }

      return this.authService.refreshToken().pipe(
        switchMap(response => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken);
          return next.handle(this.addToken(request, response.accessToken));
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.logout().subscribe();
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(request, token)))
      );
    }
  }
}
