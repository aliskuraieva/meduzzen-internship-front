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
  status: any = 'Checking...';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.checkHealth().subscribe({
      next: (res) => (this.status = res),
      error: () => (this.status = 'API is down'),
    });
  }
}
