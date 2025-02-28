import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../interfaces/user.interface';
import { Auth0AuthService } from './auth0-auth.service';
import { UserRegistrationService } from '../../domain/user/components/user-registration/user-registration.service';
import { UserAuthorizationService } from '../../domain/user/components/user-authorization/user-authorization.service';
import { Router } from '@angular/router';

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
    private http: HttpClient,
    private router: Router
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
    this.router.navigate(['/users/login']);
  }

  getUser(): Observable<UserData | null> {
    return this.userSubject.asObservable();
  }

  registerUser(email: string, password: string) {
    return this.userRegistrationService.registerUser(email, password);
  }

  authorizationUser(email: string, password: string): Observable<any> {
    return this.userAuthorizationService.authorizationUser(email, password).pipe(
      tap(response => {
        if (response?.detail?.accessToken) {
          localStorage.setItem('access_token', response.detail.accessToken);
          localStorage.setItem('refresh_token', response.detail.refreshToken);
          this.isAuthenticatedSubject.next(true);
          this.loadUserData();
        }
      })
    );
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return of(null);
    }

    return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, { refreshToken }).pipe(
      tap(response => {
        if (response?.data?.accessToken) {
          localStorage.setItem('access_token', response.data.accessToken);
          this.isAuthenticatedSubject.next(true);
          this.loadUserData();
        }
      }),
      catchError(error => {
        console.error('Error refreshing token', error);
        this.clearTokens();
        this.router.navigate(['/users/login']);
        return of(null);
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
          if (user) {
            this.userSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError(error => {
          console.error('Error loading user data', error);
          if (error.status === 401) {
            this.refreshAccessToken().subscribe();
          } else {
            this.clearTokens();
          }
          return of(null);
        })
      ).subscribe();
    } else {
      this.auth0AuthService.getAccessToken().pipe(
        switchMap(token => {
          if (token) {
            localStorage.setItem('access_token', token);
            return this.auth0AuthService.getUser();
          }
          return of(null);
        }),
        tap(user => {
          if (user) {
            this.userSubject.next({
              username: user.nickname || user.name || '',
              email: user.email || '',
              picture: user.picture || ''
            });
            this.isAuthenticatedSubject.next(true);
          } else {
            this.isAuthenticatedSubject.next(false);
          }
        }),
        catchError(() => {
          this.isAuthenticatedSubject.next(false);
          return of(null);
        })
      ).subscribe();
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);
  }
}
