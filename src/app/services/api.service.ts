import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = import.meta.env['NG_APP_API_URL'];

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

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
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
