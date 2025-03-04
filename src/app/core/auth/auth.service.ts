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
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserData | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly apiUrl = import.meta.env['NG_APP_PUBLIC_API_URL'];
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private auth0AuthService: Auth0AuthService,
    private userRegistrationService: UserRegistrationService,
    private userAuthorizationService: UserAuthorizationService,
    private http: HttpClient,
    private router: Router
  ) {
    this.auth0AuthService.handleRedirectCallback().subscribe();
  }

  loginWithAuth0(): void {
    this.auth0AuthService.loginWithAuth0();
  }

  registerWithAuth0(): void {
    this.auth0AuthService.registerWithAuth0();
  }

  logout(): void {
    this.auth0AuthService.logout();
    this.clearTokens();
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
    return this.userAuthorizationService.authorizationUser(email, password).pipe(
      tap((response) => {
        if (response?.detail?.accessToken) {
          this.saveTokens(response.detail.accessToken, response.detail.refreshToken);
          this.isAuthenticatedSubject.next(true);
          this.loadUserData();
        }
      })
    );
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of(null);
    }
    return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, { refreshToken }).pipe(
      tap((response) => {
        if (response?.data?.accessToken) {
          this.saveTokens(response.data.accessToken, response.data.refreshToken);
          this.isAuthenticatedSubject.next(true);
          this.loadUserData();
        }
      }),
      catchError(() => of(null))
    );
  }

  loadUserData(): void {
    const storedToken = this.getAccessToken();
    if (storedToken) {
      this.loadUserFromApi(storedToken);
    } else {
      this.loadUserFromAuth0();
    }
  }

  private loadUserFromApi(storedToken: string): void {
    this.http
      .get<UserData>(`${this.apiUrl}/auth/me`, { headers: { Authorization: `Bearer ${storedToken}` } })
      .pipe(
        tap((user) => {
          if (user) {
            this.userSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError((error) => this.handleApiError(error))
      )
      .subscribe();
  }

  private loadUserFromAuth0(): void {
    this.auth0AuthService.getAccessToken().pipe(
      switchMap((token) => {
        if (token) {
          this.saveTokens(token, '');
          this.loadUserFromApi(token);
          return this.auth0AuthService.getUser().pipe(
            tap((user) => {
              if (user) {
                const mappedUser: UserData = {
                  name: user.nickname || user.name || '',
                  email: user.email || '',
                  picture: user.picture || '',
                };
                this.handleUserFromAuth0(mappedUser);
              }
            })
          );
        } else {
          return of(null);
        }
      }),
      catchError((error) => this.handleAuth0Error(error))
    ).subscribe();
  }

  private handleApiError(error: any): Observable<null> {
    console.error('Error loading user data', error);
    if (error.status === 401) {
      this.refreshAccessToken().subscribe(() => this.loadUserData());
    } else {
      this.clearTokens();
    }
    return of(null);
  }

  private handleAuth0Error(error: any): Observable<null> {
    console.error('Error loading user data from Auth0', error);
    this.clearTokens();
    return of(null);
  }

  private handleUserFromAuth0(user: UserData | null): void {
    if (user) {
      this.userSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
