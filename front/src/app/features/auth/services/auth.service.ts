import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from '@core/interfaces/sessionInformation.interface';
import { environment } from '@env/environment';
import { TokenManagerService } from '@core/services/token-manager.service';
import { RefreshTokenResponse } from '../interfaces/refreshTokenResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiPath = environment.apiAuth;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private tokenManager: TokenManagerService
  ) {
    const token = this.tokenManager.getAccessToken();
    this.isAuthenticatedSubject.next(!!token);
  }

  public register(
    registerRequest: RegisterRequest
  ): Observable<SessionInformation> {
    return this.httpClient
      .post<SessionInformation>(`${this.apiPath}/register`, registerRequest)
      .pipe(
        tap((response) => {
          this.tokenManager.saveTokens(
            response.authorization.accessToken,
            response.authorization.refreshToken
          );
          this.tokenManager.saveUser(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  public login(loginRequest: LoginRequest): Observable<SessionInformation> {
    return this.httpClient
      .post<SessionInformation>(`${this.apiPath}/login`, loginRequest)
      .pipe(
        tap((response) => {
          this.tokenManager.saveTokens(
            response.authorization.accessToken,
            response.authorization.refreshToken
          );
          this.tokenManager.saveUser(response.user);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  public logout(): Observable<void> {
    const accessToken = this.tokenManager.getAccessToken();
    const refreshToken = this.tokenManager.getRefreshToken();

    if (!accessToken && !refreshToken) {
      this.clearSession();
      return of(void 0);
    }

    if (!accessToken && refreshToken) {
      return this.refreshToken().pipe(
        switchMap(() => this.performLogout()),
        catchError(() => {
          this.clearSession();
          return of(void 0);
        })
      );
    }

    return this.performLogout();
  }

  public refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.tokenManager.getRefreshToken();

    if (!refreshToken) {
      this.clearSession();
      return throwError(() => new Error('Refresh token not found'));
    }

    return this.httpClient
      .post<RefreshTokenResponse>(`${this.apiPath}/refresh-token`, {
        refreshToken: refreshToken,
      })
      .pipe(
        tap((response) => {
          this.tokenManager.saveTokens(
            response.accessToken,
            response.refreshToken || refreshToken
          );
        }),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  public checkAuthStatus(): void {
    const token = this.tokenManager.getAccessToken();
    this.isAuthenticatedSubject.next(!!token);
  }

  private performLogout(): Observable<void> {
    return this.httpClient.post<void>(`${this.apiPath}/logout`, {}).pipe(
      tap(() => this.clearSession()),
      catchError((error) => {
        // Allway clear session on error
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  private clearSession(): void {
    this.tokenManager.clearTokens();
    this.isAuthenticatedSubject.next(false);
  }
}
