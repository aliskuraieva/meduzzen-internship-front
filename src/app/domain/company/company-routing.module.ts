import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';

const routes: Routes = [
  { path: 'list', component: CompanyListComponent },
  { path: 'profile/:id', component: CompanyProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {}
