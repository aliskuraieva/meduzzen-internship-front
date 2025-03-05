import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {
  company: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('id');

    if (companyId) {
      this.apiService.getCompanyById(companyId).subscribe({
        next: (companyData) => {
          this.company = companyData;
        },
        error: (error) => {
          console.error('Error fetching company data:', error);
        }
      });
    }
  }

  editCompanyProfile(): void {
    console.log('Editing company profile for:', this.company);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
