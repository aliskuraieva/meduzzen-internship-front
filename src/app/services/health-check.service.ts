import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HealthCheckService {
  constructor(private http: HttpClient) {}

  checkHealth(): Observable<any> {
    return this.http.get('http://your-api-url/health');
  }
}
