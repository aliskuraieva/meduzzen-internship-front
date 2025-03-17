import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../core/interfaces/company.interface';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-company-modal',
  templateUrl: './create-company-modal.component.html',
  styleUrls: ['./create-company-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateCompanyModalComponent {
  @Output() companyCreated = new EventEmitter<Company>();
  companyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      isVisible: [true],
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      const companyData = this.companyForm.value;
      delete companyData.isVisible;

      this.companyService.createCompany(companyData).subscribe({
        next: (company) => {
          this.companyCreated.emit(company);
          this.toastr.success('Company created successfully');
          this.companyForm.reset();
          this.router.navigate(['/companies/profile', company.id]); // Use company.id instead of companyId
        },
        error: () => {
          this.toastr.error('Failed to create company');
        },
      });
    }
  }

  closeModal() {
    this.companyForm.reset();
  }
}
