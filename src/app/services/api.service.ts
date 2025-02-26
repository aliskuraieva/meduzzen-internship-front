import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersResponse } from '../core/interfaces/user.interface';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = import.meta.env['NG_APP_PUBLIC_API_URL'];

  constructor(private http: HttpClient) {}

  getCompanyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/companies/${id}`);
  }

  getAllCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/companies`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  getCurrentUser(): Observable<{ username: string; email: string }> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };
    return this.http.get<{ username: string; email: string }>(`${this.apiUrl}/auth/me`, { headers });
  }


  getAllUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`);
  }

  registerUser(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { email, password });
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password });
  }

  checkHealth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
