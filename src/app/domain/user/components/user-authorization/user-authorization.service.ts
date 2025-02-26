import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthorizationService {
  private authorizationUrl = `${import.meta.env['NG_APP_PUBLIC_API_URL']}/auth/login`;

  constructor(private http: HttpClient) {}

  authorizationUser(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(this.authorizationUrl, body);
  }
}
