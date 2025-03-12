import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  companies: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchCompanies();
  }

  fetchCompanies(): void {
    this.apiService.getAllCompanies().subscribe({
      next: (companiesData) => {
        this.companies = companiesData;
      },
      error: (error) => {
        console.error('Error fetching companies data:', error);
      },
      complete: () => {
      }
    });
  }
}
