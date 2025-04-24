import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '@core/interfaces/user.interface';
import { environment } from '@env/environment';
import { TokenManagerService } from '@core/services/token-manager.service';
import { SessionInformation } from '@core/interfaces/sessionInformation.interface';
import { UserUpdateRequest } from '../interfaces/user-update-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUsers}`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenManager: TokenManagerService
  ) {
    const storedUser = this.tokenManager.getUser();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.tokenManager.saveUser(user);
      })
    );
  }

  public updateCurrentUser(updateData: UserUpdateRequest): Observable<SessionInformation> {
    return this.http.put<SessionInformation>(`${this.apiUrl}/me`, updateData).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user);
        this.tokenManager.saveUser(response.user);

        // If email has changed, update the token
        if (response.authorization && response.authorization.accessToken) {
          this.tokenManager.saveTokens(
            response.authorization.accessToken,
            response.authorization.refreshToken
          );
        }
      })
    );
  }


  public ensureUserLoaded(): Observable<User> {
    const currentUser = this.currentUserSubject.getValue();
    if (currentUser) {
      return new Observable(observer => {
        observer.next(currentUser);
        observer.complete();
      });
    } else {
      return this.getCurrentUser();
    }
  }
}
