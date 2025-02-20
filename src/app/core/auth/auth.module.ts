import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';

@NgModule({
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      domain: import.meta.env['NG_APP_PUBLIC_AUTH0_DOMAIN'],
      clientId: import.meta.env['NG_APP_PUBLIC_AUTH0_CLIENT_ID'],
    }),
  ],
})
export class AppModule {}
