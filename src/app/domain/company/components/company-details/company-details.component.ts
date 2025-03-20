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
        if (currentUser && company) {
          this.isOwner = currentUser.id === company.owner.id;
        }
      },
    });
  }

  toggleVisibility(): void {
    if (this.company && this.isOwner) {
      const newVisibility = !this.company.isVisible;
      this.companyService
        .updateCompany(this.company.id, { isVisible: newVisibility })
        .subscribe({
          next: (updatedCompany) => {
            this.company = updatedCompany;
          },
        });
    }
  }

  deleteCompany(): void {
    if (this.company && this.isOwner) {
      this.companyService.deleteCompany(this.company.id).subscribe({
        next: () => {
          this.router.navigate(['/companies']);
        },
      });
    }
  }

  editCompany(): void {
    if (this.isOwner) {
      this.isEditing = true;
    }
  }

  saveChanges(): void {
    if (this.company && this.editedCompany) {
      this.companyService
        .updateCompany(this.company.id, this.editedCompany)
        .subscribe({
          next: (updatedCompany) => {
            this.company = updatedCompany;
            this.isEditing = false;
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/companies/list']);
  }
}
