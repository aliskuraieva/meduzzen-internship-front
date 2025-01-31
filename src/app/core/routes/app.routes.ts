import { Routes } from '@angular/router';
import { AboutComponent } from '../../domain/about/about.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },

  { path: 'companies', loadChildren: () => import('../../domain/company/company.routes').then(m => m.companyRoutes) },
  { path: 'users', loadChildren: () => import('../../domain/user/user.routes').then(m => m.userRoutes) },

  { path: '**', redirectTo: '/about' }
];
