import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'about', loadChildren: () => import('./domain/about/about.module').then(m => m.AboutModule) },
  { path: 'user', loadChildren: () => import('./domain/user/user.module').then(m => m.UserModule) },
  { path: 'company', loadChildren: () => import('./domain/company/company.module').then(m => m.CompanyModule) },
  { path: '', redirectTo: 'about', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
