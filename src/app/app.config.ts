import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideToastr } from 'ngx-toastr';
import { appRoutes } from '../app/core/routes/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAuth0({
      domain: import.meta.env['NG_APP_PUBLIC_AUTH0_DOMAIN'],
      clientId: import.meta.env['NG_APP_PUBLIC_AUTH0_CLIENT_ID'],
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: import.meta.env['NG_APP_PUBLIC_AUTH0_AUDIENCE'],
        scope: 'openid profile email',
      },
    }),
    provideToastr(),
  ],
};
