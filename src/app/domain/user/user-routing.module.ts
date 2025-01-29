import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserAuthorizationComponent } from './components/user-authorization/user-authorization.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  { path: 'register', component: UserRegistrationComponent },
  { path: 'login', component: UserAuthorizationComponent },
  { path: 'profile/:id', component: UserProfileComponent },
  { path: 'list', component: UserListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
