import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { companyRoutes } from './company.routes';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(companyRoutes)
  ]
})
export class CompanyModule {}
