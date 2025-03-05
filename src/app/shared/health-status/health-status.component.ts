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
    this.apiService.checkHealth().subscribe({
      next: (res) => (this.healthStatus = res),
      error: (err) => {
        this.healthStatus = {
          status_code: 500,
          detail: 'API is down',
          result: 'not working',
        };
      },
    });
  }
}
