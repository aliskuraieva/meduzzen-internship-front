import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../core/interfaces/company.interface';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    const companyId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchCompanyDetails(companyId);
  }

  fetchCompanyDetails(companyId: number): void {
    this.companyService.getCompanyById(companyId).subscribe({
      next: (company) => {
        this.company = company;
        this.isOwner = this.checkIfOwner(Number(company.ownerId));
      },
    });
  }

  checkIfOwner(ownerId: number): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    return currentUser?.id === ownerId;
  }

  toggleVisibility(): void {
    if (this.company) {
      const newVisibility = !this.company.visibility;
      this.companyService
        .updateCompany(this.company.id, { visibility: newVisibility })
        .subscribe({
          next: (updatedCompany) => {
            this.company = updatedCompany;
          },
        });
    }
  }

  deleteCompany(): void {
    if (this.company) {
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
          },
        });
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.fetchCompanyDetails(this.company!.id);
  }

  goBack(): void {
    this.router.navigate(['/companies/list']);
  }
}
