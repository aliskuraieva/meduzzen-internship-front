import { Routes } from '@angular/router';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserAuthorizationComponent } from './components/user-authorization/user-authorization.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { GuestGuard } from '../../core/guards/guest.guard';
import { AuthGuard } from '../../core/guards/auth.guard';

export const userRoutes: Routes = [
  { path: 'register', component: UserRegistrationComponent, canActivate: [GuestGuard] },
  { path: 'login', component: UserAuthorizationComponent, canActivate: [GuestGuard] },
  { path: 'list', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: UserDetailComponent, canActivate: [AuthGuard] }
];
