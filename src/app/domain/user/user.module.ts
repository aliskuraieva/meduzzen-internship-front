import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserAuthorizationComponent } from './components/user-authorization/user-authorization.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UserRegistrationComponent,
    UserAuthorizationComponent,
    UserProfileComponent,
    UserDetailComponent,
    UserListComponent
  ]
})
export class UserModule {}
