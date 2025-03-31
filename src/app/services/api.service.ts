import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { UsersResponse } from '../core/interfaces/user.interface';
import {
  Company,
  BaseResponse,
  CompaniesDetail,
} from '../core/interfaces/company.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = import.meta.env['NG_APP_PUBLIC_API_URL'];

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getCompanyById(id: number): Observable<Company> {
    return this.http
      .get<BaseResponse<Company>>(`${this.apiUrl}/companies/${id}`)
      .pipe(
        map((response) => response.detail),
        catchError((error) => this.handleError(error))
      );
  }

  getAllCompanies(
    page: number = 1,
    pageSize: number = 10
  ): Observable<CompaniesDetail> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http
      .get<BaseResponse<CompaniesDetail>>(`${this.apiUrl}/companies`, {
        params,
      })
      .pipe(
        map((response) => response.detail),
        catchError((error) => this.handleError(error))
      );
  }

  createCompany(company: Partial<Company>): Observable<Company> {
    return this.http
      .post<Company>(`${this.apiUrl}/companies`, company)
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateCompany(id: number, company: Partial<Company>): Observable<BaseResponse<Company>> {
    console.log('PATCH запит:', id, company);
    return this.http.patch<BaseResponse<Company>>(`${this.apiUrl}/companies/${id}`, company);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/companies/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateVisibility(id: number, isVisible: boolean): Observable<Company> {
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.patch<Company>(
      `${this.apiUrl}/companies/${id}/visibility`,
      { isVisible },
      { headers }
    );
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

  updateUserProfile(updatedUser: {
    username: string;
    password?: string;
  }): Observable<any> {
    const token = localStorage.getItem('access_token');

    if (token) {
      return this.http.put(`${this.apiUrl}/users/me`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    return of(null);
  }

  getAllUsers(
    page: number = 1,
    pageSize: number = 10
  ): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
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
