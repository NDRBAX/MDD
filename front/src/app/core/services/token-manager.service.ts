import { Injectable } from '@angular/core';
import { User } from '@core/interfaces/user.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenManagerService {
  private readonly TOKEN_KEYS = {
    ACCESS: 'access_token',
    REFRESH: 'refresh_token',
    USER: 'auth_user',
  };

  constructor() {}

  public saveTokens(accessToken: string, refreshToken: string): void {
    this.setSecureCookie(this.TOKEN_KEYS.ACCESS, accessToken,  environment.jwtAccessExpirationMilliseconds );
    this.setSecureCookie(this.TOKEN_KEYS.REFRESH, refreshToken, environment.jwtRefreshExpirationMilliseconds);
  }

  public saveUser(user: User): void {
    this.setSecureCookie(this.TOKEN_KEYS.USER, JSON.stringify(user), environment.jwtRefreshExpirationMilliseconds);
  }

  public getAccessToken(): string | null {
    return this.getSecureCookie(this.TOKEN_KEYS.ACCESS);
  }

  public getRefreshToken(): string | null {
    return this.getSecureCookie(this.TOKEN_KEYS.REFRESH);
  }

  public getUser(): User | null {
    const userStr = this.getSecureCookie(this.TOKEN_KEYS.USER);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  public clearTokens(): void {
    console.log('Clearing tokens');
    Object.values(this.TOKEN_KEYS).forEach((key) =>
      this.removeSecureCookie(key)
    );
  }

  private setSecureCookie(name: string, value: string, expiryMilliseconds: number): void {
    const date = new Date();
    date.setTime(date.getTime() + expiryMilliseconds);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict; Secure`;
  }

  private getSecureCookie(name: string): string | null {
    const cookieNameKey = `${name}=`;
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const trimmedCookie = cookie.trim();
      if (trimmedCookie.startsWith(cookieNameKey)) {
        return trimmedCookie.substring(cookieNameKey.length);
      }
    }

    return null;
  }

  private removeSecureCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=-99999999; path=/; SameSite=Strict; Secure`;
  }
}
