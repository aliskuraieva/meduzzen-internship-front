import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserData, User } from '../interfaces/user.interface';
import { Auth0AuthService } from './auth0-auth.service';
import { UserRegistrationService } from '../../domain/user/components/user-registration/user-registration.service';
import { UserAuthorizationService } from '../../domain/user/components/user-authorization/user-authorization.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserData | null>(null);
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly apiUrl = import.meta.env['NG_APP_PUBLIC_API_URL'];
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  constructor(
    private auth0AuthService: Auth0AuthService,
    private userRegistrationService: UserRegistrationService,
    private userAuthorizationService: UserAuthorizationService,
    private http: HttpClient,
    private router: Router
  ) {
    this.auth0AuthService.handleRedirectCallback().subscribe();
    this.loadUserData();
  }

  loginWithAuth0(): void {
    this.auth0AuthService.loginWithAuth0();
  }

  registerWithAuth0(): void {
    this.auth0AuthService.registerWithAuth0();
  }

  logout(): void {
    console.warn('Logout triggered');
    this.auth0AuthService.logout();
    this.clearTokens();
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getUser(): Observable<UserData | null> {
    return this.userSubject.asObservable();
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  registerUser(email: string, password: string) {
    return this.userRegistrationService.registerUser(email, password);
  }

  authorizationUser(email: string, password: string): Observable<any> {
    return this.userAuthorizationService
      .authorizationUser(email, password)
      .pipe(
        tap((response) => {
          if (response?.detail?.accessToken) {
            this.saveTokens(
              response.detail.accessToken,
              response.detail.refreshToken
            );
            this.isAuthenticatedSubject.next(true);
            this.loadUserData();
          }
        })
      );
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    console.log('Attempting refresh, refreshToken:', refreshToken);
    if (!refreshToken) {
      console.warn('No refresh token found, cannot refresh');
      return of(null);
    }
    return this.http
      .post<any>(`${this.apiUrl}/auth/refresh-token`, { refreshToken })
      .pipe(
        tap((response) => {
          console.log('Token refresh response:', response);
          if (response?.data?.accessToken) {
            this.saveTokens(
              response.data.accessToken,
              response.data.refreshToken
            );
            this.isAuthenticatedSubject.next(true);
            this.loadUserData();
          }
        }),
        catchError((error) => {
          console.error('Error refreshing token:', error);
          return of(null);
        })
      );
  }

  loadUserData(): void {
    const storedToken = this.getAccessToken();
    console.log('loadUserData called, storedToken:', storedToken);
    if (storedToken) {
      this.loadUserFromApi(storedToken);
    } else {
      console.warn('No stored token found, trying Auth0 login');
      this.loadUserFromAuth0();
    }
  }

  private loadUserFromApi(storedToken: string): void {
    this.http
      .get<UserData>(`${this.apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .pipe(
        tap((user) => {
          if (user) {
            this.userSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          } else {
            this.isAuthenticatedSubject.next(false);
          }
        }),
        catchError((error) => {
          console.error('Error in loadUserFromApi:', error);
          this.isAuthenticatedSubject.next(false);
          return this.handleApiError(error);
        })
      )
      .subscribe();
  }

  private loadUserFromAuth0(): void {
    this.auth0AuthService
      .getAccessToken()
      .pipe(
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
      )
      .subscribe();
  }

  private handleApiError(error: any): Observable<null> {
    console.error('handleApiError called:', error);
    if (error.status === 401) {
      console.warn('401 error detected, attempting token refresh');
      this.refreshAccessToken().subscribe((newToken) => {
        if (newToken) {
          this.loadUserData();
        } else {
          this.logout();
        }
      });
    } else {
      console.error('Clearing tokens due to non-401 error');
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
      localStorage.setItem('userId', user.id?.toString() || '');
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
    console.warn('Clearing tokens');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
