import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,
    AboutComponent,
  ],
})
export class AboutModule {}
