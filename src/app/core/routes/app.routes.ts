import { Routes } from '@angular/router';
import { AboutComponent } from '../../domain/about/about.component';
import { HealthStatusComponent } from '../../shared/health-status/health-status.component';
import { UserRegistrationComponent } from '../../domain/user/components/user-registration/user-registration.component';
import { UserAuthorizationComponent } from '../../domain/user/components/user-authorization/user-authorization.component';
import { UserProfileComponent } from '../../domain/user/components/user-profile/user-profile.component';
import { AuthGuard } from '../guards/auth.guard';
import { GuestGuard } from '../guards/guest.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'health-check', component: HealthStatusComponent },

  {
    path: 'register',
    component: UserRegistrationComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'login',
    component: UserAuthorizationComponent,
    canActivate: [GuestGuard],
  },

  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'companies',
    loadChildren: () =>
      import('../../domain/company/company.routes').then(
        (m) => m.companyRoutes
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../../domain/user/user.routes').then((m) => m.userRoutes),
  },

  { path: '**', redirectTo: '/about' },
];
