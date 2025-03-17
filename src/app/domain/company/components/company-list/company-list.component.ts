import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../core/interfaces/company.interface';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  errorMessage: string = '';
  totalCompanies: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private companyService: CompanyService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCompanies();
  }

  fetchCompanies(): void {
    this.companyService
      .getAllCompanies(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.companies = response.companies;
          this.totalCompanies = response.total;
          this.totalPages = Math.ceil(this.totalCompanies / this.pageSize);
        },
        error: (error) => {
          this.errorMessage =
            'Error fetching companies data. Please try again later.';
          console.error('Error fetching companies data:', error);
        },
      });
  }

  goToCompanyProfile(companyId: number): void {
    this.router.navigate(['/companies/profile', companyId]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchCompanies();
  }

  toggleVisibility(company: Company): void {
    const newVisibility = !company.visibility;
    this.companyService.updateVisibility(company.id, newVisibility).subscribe({
      next: (updatedCompany) => {
        company.visibility = updatedCompany.visibility;
      },
      error: (error) => {
        console.error('Error updating visibility:', error);
      },
    });
  }
}
