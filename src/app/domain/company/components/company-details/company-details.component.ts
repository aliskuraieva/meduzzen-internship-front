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
    console.log('Fetching company details...');

    combineLatest([
      this.authService.currentUser$,
      this.companyService.getCompanyById(companyId),
    ]).subscribe({
      next: ([currentUser, company]) => {
        console.log('Company:', company);
        console.log('Current User:', currentUser);

        this.company = company;
        if (currentUser && company) {
          this.isOwner = currentUser.id === company.owner.id;

          console.log('Is Owner after check:', this.isOwner);
        }

      },
    });
  }

  toggleVisibility(): void {
    if (this.company && this.isOwner) {
      const newVisibility = !this.company.visibility;
      this.companyService
        .updateCompany(this.company.id, { visibility: newVisibility })
        .subscribe({
          next: (updatedCompany) => {
            this.company = updatedCompany;
            console.log('Company visibility updated:', updatedCompany);
          },
        });
    } else {
      console.log('User is not the owner, cannot update visibility');
    }
  }

  deleteCompany(): void {
    if (this.company && this.isOwner) {
      this.companyService.deleteCompany(this.company.id).subscribe({
        next: () => {
          console.log('Company deleted successfully');
          this.router.navigate(['/companies']);
        },
      });
    } else {
      console.log('User is not the owner, cannot delete company');
    }
  }

  editCompany(): void {
    if (this.isOwner) {
      this.isEditing = true;
      console.log('Editing mode activated');
    } else {
      console.log('User is not the owner, cannot edit company');
    }
  }

  saveChanges(): void {
    if (this.company) {
      const updatedCompany: Partial<Company> = {
        name: this.company.name,
        description: this.company.description,
        visibility: this.company.visibility,
      };
      this.companyService
        .updateCompany(this.company.id, updatedCompany)
        .subscribe({
          next: (updatedCompany) => {
            this.company = updatedCompany;
            this.isEditing = false;
            console.log('Company updated successfully:', updatedCompany);
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/companies/list']);
    console.log('Navigating back to company list');
  }
}
