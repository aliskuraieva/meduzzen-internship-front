import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterResponse } from '../../../../core/interfaces/register-response.interface';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  private registerUrl = `${environment.apiUrl}/register`;

  constructor(private http: HttpClient) {}

  registerUser(email: string, password: string): Observable<RegisterResponse> {
    const body = { email, password };
    return this.http.post<RegisterResponse>(this.registerUrl, body);
  }
}
