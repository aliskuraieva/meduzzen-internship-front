import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
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
  }

  loginWithAuth0(): void {
    this.auth0AuthService.loginWithAuth0();
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
    const token = this.token;
    if (token) {
      this.validateToken(token).pipe(
        switchMap(isValid => {
          if (isValid) {
            return this.auth0AuthService.getUser();
          } else {
            return this.refreshToken().pipe(
              switchMap(newToken => {
                if (newToken) {
                  localStorage.setItem('access_token', newToken);
                  return this.auth0AuthService.getUser();
                } else {
                  throw new Error('Token refresh failed');
                }
              })
            );
          }
        }),
        catchError(error => {
          console.error('Error loading user data', error);
          this.logout();
          return [];
        })
      ).subscribe(user => {
        if (user) {
          const userData: UserData = {
            username: user.name || '',
            email: user.email || '',
          };
          this.userSubject.next(userData);
        }
      });
    }
  }

  private validateToken(token: string): Observable<boolean> {
    return this.http.get('/api/auth/validate-token', {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  private refreshToken(): Observable<string | null> {
    if (this.refreshTokenInProgress) {
      return of(null);
    }

    this.refreshTokenInProgress = true;

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.refreshTokenInProgress = false;
      return of(null);
    }

    return this.http.post<{ access_token: string }>('/api/auth/refresh-token', { refresh_token: refreshToken }).pipe(
      map(response => response.access_token),
      catchError(() => {
        this.refreshTokenInProgress = false;
        return of(null);
      }),
      switchMap(newToken => {
        this.refreshTokenInProgress = false;
        return of(newToken);
      })
    );
  }

  get token(): string | null {
    return localStorage.getItem('access_token');
  }
}
