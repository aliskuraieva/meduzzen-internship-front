import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth0AuthService {
  constructor(private auth0: Auth0Service) {}

  loginWithAuth0(): void {
    this.auth0.loginWithRedirect();
  }

  logout(): void {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  getUser(): Observable<any> {
    return this.auth0.user$;
  }

  getAccessToken(): Observable<string> {
    return this.auth0.getAccessTokenSilently();
  }
}
