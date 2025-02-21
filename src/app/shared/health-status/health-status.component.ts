import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-health-status',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  template: `<p>Health Check Status: {{ status | json }}</p>`,
})
export class HealthStatusComponent implements OnInit {
  status: string = 'Checking...';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log(import.meta.env['NG_APP_PUBLIC_API_URL']);
    this.apiService.checkHealth().subscribe({
      next: (res: string) => (this.status = res),
      error: (err) => {
        console.error('Health check failed:', err);
        this.status = 'API is down';
      },
    });
  }
}
