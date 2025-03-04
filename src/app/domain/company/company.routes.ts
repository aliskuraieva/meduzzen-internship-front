import { Routes } from '@angular/router';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const companyRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: CompanyListComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: CompanyProfileComponent, canActivate: [AuthGuard] }
];
