import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../interfaces/user.interface';
import { Auth0AuthService } from './auth0-auth.service';
import { UserRegistrationService } from '../../domain/user/components/user-registration/user-registration.service';
import { UserAuthorizationService } from '../../domain/user/components/user-authorization/user-authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserData | null>(null);
  private refreshTokenInProgress = false;

  constructor(
    private auth0AuthService: Auth0AuthService,
    private userRegistrationService: UserRegistrationService,
    private userAuthorizationService: UserAuthorizationService,
    private http: HttpClient
  ) {
    this.loadUserData();
    this.auth0AuthService.handleRedirectCallback();
  }

  loginWithAuth0(): void {
    this.auth0AuthService.loginWithAuth0();
  }

  registerWithAuth0(): void {
    this.auth0AuthService.registerWithAuth0();
  }

  logout(): void {
    this.auth0AuthService.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.userSubject.next(null);
  }

  getUser(): Observable<UserData | null> {
    return this.userSubject.asObservable();
  }

  registerUser(email: string, password: string) {
    return this.userRegistrationService.registerUser(email, password);
  }

  authorizationUser(email: string, password: string) {
    return this.userAuthorizationService.authorizationUser(email, password);
  }

  private loadUserData(): void {
    this.auth0AuthService.getUser().pipe(
      tap(user => {
        if (user) {
          const userData: UserData = {
            username: user.name || '',
            email: user.email || '',
          };
          localStorage.setItem('access_token', user.sub || '');
          this.userSubject.next(userData);
        }
      }),
      catchError(error => {
        console.error('Error loading user data', error);
        this.logout();
        return of(null);
      })
    ).subscribe();
  }
}
