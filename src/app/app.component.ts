import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    ListUsersComponent,
    UserProfileComponent,
    CompanyProfileComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
