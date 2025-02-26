import { Injectable } from '@angular/core';
import { AuthService as Auth0Service, User } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Auth0AuthService {
  constructor(private auth0: Auth0Service) {}

  loginWithAuth0(): void {
    this.auth0.loginWithRedirect();
  }

  registerWithAuth0(): void {
    this.auth0.loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' }
    });
  }

  logout(): void {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  getUser(): Observable<User | null> {
    return this.auth0.user$.pipe(filter(user => user !== undefined));
  }

  getAccessToken(): Observable<string> {
    return this.auth0.getAccessTokenSilently();
  }

  handleRedirectCallback(): Observable<any> {
    return this.auth0.handleRedirectCallback();
  }
}
