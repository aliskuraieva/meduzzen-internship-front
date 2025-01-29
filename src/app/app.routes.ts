import { Routes } from '@angular/router';
import { AboutComponent } from './domain/about/about.component';
import { UserProfileComponent } from './domain/user/components/user-profile/user-profile.component';
import { UserListComponent } from './domain/user/components/user-list/user-list.component';
import { CompanyProfileComponent } from './domain/company/components/company-profile/company-profile.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },

  { path: 'companies', loadChildren: () => import('./domain/company/company-routing.module').then(m => m.CompanyRoutingModule) },
  { path: 'users', loadChildren: () => import('./domain/user/user-routing.module').then(m => m.UserRoutingModule) },

  { path: 'profile', component: UserProfileComponent },
  { path: 'users-list', component: UserListComponent },
  { path: 'company-profile', component: CompanyProfileComponent },

  { path: '**', redirectTo: '/about' }
];
