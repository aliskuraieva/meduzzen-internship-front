import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-health-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-status.component.html',
  styleUrls: ['./health-status.component.scss'],
})
export class HealthStatusComponent implements OnInit {
  healthStatus: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log(import.meta.env['NG_APP_PUBLIC_API_URL']);
    this.apiService.checkHealth().subscribe({
      next: (res) => (this.healthStatus = res),
      error: (err) => {
        console.error('Health check failed:', err);
        this.healthStatus = { status_code: 500, detail: 'API is down', result: 'not working' };
      },
    });
  }
}
