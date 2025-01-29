import { Routes } from '@angular/router';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';

export const companyRoutes: Routes = [
  { path: 'list', component: CompanyListComponent },
  { path: 'profile/:id', component: CompanyProfileComponent }
];
