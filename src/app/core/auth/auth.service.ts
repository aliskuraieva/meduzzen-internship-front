import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { Auth0AuthService } from './auth0-auth.service';
import { UserRegistrationService } from '../../domain/user/components/user-registration/user-registration.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private auth0AuthService: Auth0AuthService,
    private userRegistrationService: UserRegistrationService
  ) {
    this.loadUserData();
  }

  loginWithAuth0(): void {
    this.auth0AuthService.loginWithAuth0();
  }

  logout(): void {
    this.auth0AuthService.logout();
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  registerUser(email: string, password: string) {
    return this.userRegistrationService.registerUser(email, password);
  }

  private loadUserData(): void {
    this.auth0AuthService.getAccessToken().pipe(
      switchMap(token => {
        if (token) {
          localStorage.setItem('access_token', token);
        }
        return this.auth0AuthService.getUser();
      }),
      catchError(error => {
        console.error('Error loading user data', error);
        return [];
      })
    ).subscribe(user => {
      if (user) {
        const userData: User = {
          name: user.name || '',
          email: user.email || '',
        };
        this.userSubject.next(userData);
      }
    });
  }

  get token(): string | null {
    return localStorage.getItem('access_token');
  }
}
