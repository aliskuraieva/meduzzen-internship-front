import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';

@NgModule({
  declarations: [
    CompanyListComponent,
    CompanyProfileComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule
  ]
})
export class CompanyModule {}
