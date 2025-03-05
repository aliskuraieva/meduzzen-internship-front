import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterResponse } from '../../../../core/interfaces/register-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  private registerUrl = `${import.meta.env['NG_APP_PUBLIC_API_URL']}/auth/register`;

  constructor(private http: HttpClient) {}

  registerUser(email: string, password: string): Observable<RegisterResponse> {
    const body = { email, password };
    return this.http.post<RegisterResponse>(this.registerUrl, body);
  }
}
