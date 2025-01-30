import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './state/app.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({ testString: appReducer })
  ]
})
export class AppModule {}
