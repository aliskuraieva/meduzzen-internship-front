import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../core/interfaces/company.interface';
import { AuthService } from '../../../../core/auth/auth.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
})
export class CompanyDetailsComponent implements OnInit {
  company: Company | null = null;
  isEditing = false;
  isOwner = false;
  editedCompany: Partial<Company> = {};

  constructor(
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const companyId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchCompanyDetails(companyId);
  }

  fetchCompanyDetails(companyId: number): void {
    combineLatest([
      this.authService.currentUser$,
      this.companyService.getCompanyById(companyId),
    ]).subscribe({
      next: ([currentUser, company]) => {
        this.company = company;
        this.editedCompany = { ...company };
        console.log('Fetched company details:', company);
        console.log('Initial editedCompany:', this.editedCompany);
        if (currentUser && company) {
          this.isOwner = currentUser.id === company.owner.id;
        }
      },
      error: (err) => console.error('Error fetching company details:', err),
    });
  }

  toggleVisibility(): void {
    if (this.company && this.isOwner) {
      const newVisibility = !this.company.isVisible;
      console.log('Toggling visibility. New value:', newVisibility);
      this.companyService
        .updateCompany(this.company.id, { isVisible: newVisibility })
        .subscribe({
          next: (response) => {
            const updatedCompany = response.detail; // Оновлену компанію беремо з response.detail
            this.company = updatedCompany;
            this.editedCompany = { ...updatedCompany }; // Оновлюємо editedCompany
            console.log('Visibility updated. New company:', updatedCompany);
          },
          error: (err) => console.error('Error updating visibility:', err),
        });
    }
  }



  deleteCompany(): void {
    if (this.company && this.isOwner) {
      console.log('Deleting company with ID:', this.company.id);
      this.companyService.deleteCompany(this.company.id).subscribe({
        next: () => {
          console.log('Company deleted, navigating back to companies list.');
          this.router.navigate(['/companies']);
        },
        error: (err) => console.error('Error deleting company:', err),
      });
    }
  }

  editCompany(): void {
    if (this.isOwner) {
      this.isEditing = true;
      console.log('Started editing company:', this.editedCompany);
    }
  }

  saveChanges(): void {
    if (this.company && this.editedCompany) {
      const { id, createdAt, updatedAt, owner, ...companyData } =
        this.editedCompany;

      console.log('Sending update request:', companyData);

      this.companyService
        .updateCompany(this.company.id, companyData)
        .subscribe({
          next: (response) => {
            console.log('Updated company from server:', response);

            const updatedCompany = response.detail;

            this.company = updatedCompany;
            this.editedCompany = { ...updatedCompany };
            console.log('Updated editedCompany:', this.editedCompany);

            this.isEditing = false;
          },
          error: (err) => console.error('Error updating company:', err),
        });
    }
  }

  goBack(): void {
    console.log('Navigating back to companies list');
    this.router.navigate(['/companies/list']);
  }
}
