import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideToastr } from 'ngx-toastr';
import { provideStore } from '@ngrx/store';
import { appRoutes } from '../app/core/routes/app.routes';
import { appReducer } from '../app/core/state/app.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideStore({ testString: appReducer }),
    provideHttpClient(),
    provideAuth0({
      domain: window.__env__?.['NG_APP_PUBLIC_AUTH0_DOMAIN'] || '',
      clientId: window.__env__?.['NG_APP_PUBLIC_AUTH0_CLIENT_ID'] || '',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: window.__env__?.['NG_APP_PUBLIC_AUTH0_AUDIENCE'] || '',
        scope: 'openid profile email',
      },
    }),
    provideToastr(),
  ],
};
