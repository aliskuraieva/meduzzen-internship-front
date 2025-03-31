import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Company, CompaniesDetail, BaseResponse } from '../core/interfaces/company.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private companiesSubject = new BehaviorSubject<Company[]>([]);
  private currentCompanySubject = new BehaviorSubject<Company | null>(null);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  getAllCompanies(
    page: number = 1,
    pageSize: number = 10
  ): Observable<CompaniesDetail> {
    return this.apiService.getAllCompanies(page, pageSize).pipe(
      map((response: CompaniesDetail) => response),
      catchError((error) => {
        this.notificationService.error('Error fetching companies');
        return throwError(() => error);
      })
    );
  }

  getCompanyById(id: number): Observable<Company> {
    return this.apiService.getCompanyById(id).pipe(
      map((company: Company) => company),
      catchError((error) => {
        this.notificationService.error('Error fetching company');
        return throwError(() => error);
      })
    );
  }

  createCompany(company: Partial<Company>): Observable<Company> {
    return this.apiService.createCompany(company).pipe(
      tap((newCompany) => {
        this.companiesSubject.next([
          ...this.companiesSubject.getValue(),
          newCompany,
        ]);
        this.notificationService.success('Company created successfully');
      }),
      catchError((error) => {
        this.notificationService.error('Error creating company');
        return throwError(() => error);
      })
    );
  }

  updateCompany(id: number, company: Partial<Company>): Observable<BaseResponse<Company>> {
    return this.apiService.updateCompany(id, company).pipe(
      tap((response) => {
        const companies = this.companiesSubject.getValue();
        const companyIndex = companies.findIndex((comp) => comp.id === id);
        if (companyIndex !== -1) {
          companies[companyIndex] = response.detail;
          this.companiesSubject.next(companies);
        }
        this.notificationService.success('Company updated successfully');
      }),
      catchError((error) => {
        this.notificationService.error('Error updating company');
        return throwError(() => error);
      })
    );
  }


  deleteCompany(id: number): Observable<void> {
    return this.apiService.deleteCompany(id).pipe(
      tap(() => {
        const companies = this.companiesSubject.getValue();
        const updatedCompanies = companies.filter(
          (company) => company.id !== id
        );
        this.companiesSubject.next(updatedCompanies);
        this.notificationService.success('Company deleted successfully');
      }),
      catchError((error) => {
        this.notificationService.error('Error deleting company');
        return throwError(() => error);
      })
    );
  }

  updateVisibility(id: number, isVisible: boolean): Observable<Company> {
    return this.apiService.updateVisibility(id, isVisible).pipe(
      tap((updatedCompany) => {
        const companies = this.companiesSubject.getValue();
        const companyIndex = companies.findIndex((comp) => comp.id === id);
        if (companyIndex !== -1) {
          companies[companyIndex] = updatedCompany;
          this.companiesSubject.next(companies);
        }
        this.notificationService.success(
          'Company visibility updated successfully'
        );
      }),
      catchError((error) => {
        this.notificationService.error('Error updating company visibility');
        return throwError(() => error);
      })
    );
  }

  setPagination(page: number, pageSize: number): void {
    this.getAllCompanies(page, pageSize).subscribe((data) => {
      this.companiesSubject.next(data.companies);
    });
  }

  get companies$(): Observable<Company[]> {
    return this.companiesSubject.asObservable();
  }

  get currentCompany$(): Observable<Company | null> {
    return this.currentCompanySubject.asObservable();
  }

  setCurrentCompany(company: Company | null): void {
    this.currentCompanySubject.next(company);
  }
}
