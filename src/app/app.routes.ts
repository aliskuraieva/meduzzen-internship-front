import { Routes } from '@angular/router';

import { AboutComponent } from './pages/about/about.component';
import { UserRegistrationComponent } from './pages/user-registration/user-registration.component';
import { UserAuthorizationComponent } from './pages/user-authorization/user-authorization.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ListCompaniesComponent } from './pages/list-companies/list-companies.component';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';

export const appRoutes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: UserRegistrationComponent },
  { path: 'login', component: UserAuthorizationComponent },
  { path: 'users', component: ListUsersComponent },
  { path: 'user/:id', component: UserProfileComponent },
  { path: 'companies', component: ListCompaniesComponent },
  { path: 'company/:id', component: CompanyProfileComponent }
];
