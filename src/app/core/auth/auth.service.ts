import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly apiUrl = import.meta.env['NG_APP_PUBLIC_API_URL']
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

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
    this.isAuthenticatedSubject.next(false);
  }

  getUser(): Observable<UserData | null> {
    return this.userSubject.asObservable();
  }

  registerUser(email: string, password: string) {
    return this.userRegistrationService.registerUser(email, password);
  }

  authorizationUser(email: string, password: string): Observable<any> {
    console.log('email', email);
    console.log('password', password);

    return this.userAuthorizationService.authorizationUser(email, password).pipe(
      tap(response => {
        console.log('response', response);
        console.log('access_token', response?.access_token);

        if (response?.detail.access_token){
          localStorage.setItem('access_token', response.detail.access_token);
          localStorage.setItem('refresh_token', response.detail.refresh_token);
          this.isAuthenticatedSubject.next(true);
          this.loadUserData();
        }
      })
    );
  }

  private loadUserData(): void {
    const storedToken = localStorage.getItem('access_token');

    if (storedToken) {
      this.http.get<UserData>(`${this.apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      }).pipe(
        tap(user => {
          console.log('User from API:', user);
          if (user) {
            this.userSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError(error => {
          console.error('Error loading user data', error);
          this.isAuthenticatedSubject.next(false);
          return of(null);
        })
      ).subscribe();
    } else {
      this.auth0AuthService.getUser().pipe(
        tap(user => {
          console.log('User from Auth0:', user);
          if (user) {
            this.userSubject.next({ username: user.name || '', email: user.email || '' });
            this.isAuthenticatedSubject.next(true);
          } else {
            this.isAuthenticatedSubject.next(false);
          }
        }),
        catchError(error => {
          console.error('Error loading Auth0 user', error);
          this.isAuthenticatedSubject.next(false);
          return of(null);
        })
      ).subscribe();
    }
  }


}
