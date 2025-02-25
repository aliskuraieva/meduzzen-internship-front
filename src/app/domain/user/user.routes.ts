import { Routes } from '@angular/router';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserAuthorizationComponent } from './components/user-authorization/user-authorization.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const userRoutes: Routes = [
  { path: 'register', component: UserRegistrationComponent },
  { path: 'login', component: UserAuthorizationComponent },
  { path: 'list', component: UserListComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'profile/:id', component: UserProfileComponent }
];
