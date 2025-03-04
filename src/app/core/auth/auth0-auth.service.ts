import { Injectable } from '@angular/core';
import { AuthService as Auth0Service, User } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Auth0AuthService {
  constructor(private auth0: Auth0Service) {}

  loginWithAuth0(): void {
    this.auth0.loginWithRedirect();
  }

  registerWithAuth0(): void {
    this.auth0.loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
  }

  logout(): void {
    this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  handleRedirectCallback(): Observable<any> {
    return this.auth0.handleRedirectCallback().pipe(
      catchError((error) => {
        console.error('Auth0 redirect error:', error);
        return of(null);
      })
    );
  }

  getAccessToken(): Observable<string | null> {
    return this.auth0.getAccessTokenSilently().pipe(
      map((token) => token || null),
      catchError(() => of(null))
    );
  }

  getUser(): Observable<User | null> {
    return this.auth0.user$.pipe(
      map((user) => user || null),
      catchError(() => of(null))
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth0.isAuthenticated$.pipe(
      catchError(() => of(false))
    );
  }
}
