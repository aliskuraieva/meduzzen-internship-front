import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserAuthorizationComponent } from './components/user-authorization/user-authorization.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    UserRegistrationComponent
  ],
})
export class UserModule {}
