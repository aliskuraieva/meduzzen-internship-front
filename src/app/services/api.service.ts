import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { UsersResponse } from '../core/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = import.meta.env['NG_APP_PUBLIC_API_URL'];

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getCompanyById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/companies/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAllCompanies(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/companies`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getUserById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/users/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getCurrentUser(): Observable<{ username: string; email: string }> {
    return this.http
      .get<{ username: string; email: string }>(`${this.apiUrl}/auth/me`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateUserProfile(id: string, user: Partial<{ username: string; password: string }>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/me`, user)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAllUsers(page: number = 1, pageSize: number = 10): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  registerUser(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/register`, { email, password })
      .pipe(catchError((error) => this.handleError(error)));
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteUser(id: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/users/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  checkHealth(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned error: ${error.status}, ${error.message}`;
    }

    this.notificationService.error(errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}
