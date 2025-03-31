import { Routes } from '@angular/router';
import { CreateCompanyModalComponent } from './components/company-profile/create-company-modal.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const companyRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'profile', component: CreateCompanyModalComponent, canActivate: [AuthGuard] },
  { path: 'list', component: CompanyListComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: CompanyDetailsComponent, canActivate: [AuthGuard] }
];
