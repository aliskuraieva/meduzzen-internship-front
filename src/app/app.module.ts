import { ListUsersComponent } from './pages/list-users/list-users.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';
import { ListCompaniesComponent } from './pages/list-companies/list-companies.component';

@NgModule({
  declarations: [
    AppComponent,
    ListUsersComponent,
    UserProfileComponent,
    CompanyProfileComponent,
    ListCompaniesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
