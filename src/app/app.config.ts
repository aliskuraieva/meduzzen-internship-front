import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideToastr } from 'ngx-toastr';
import { provideStore } from '@ngrx/store';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from '../app/core/routes/app.routes';
import { appReducer } from '../app/core/state/app.reducer';
import { AuthInterceptor } from '../app/services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideStore({ testString: appReducer }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAuth0({
      domain: import.meta.env['NG_APP_PUBLIC_AUTH0_DOMAIN'],
      clientId: import.meta.env['NG_APP_PUBLIC_AUTH0_CLIENT_ID'],
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: import.meta.env['NG_APP_PUBLIC_AUTH0_AUDIENCE'],
        scope: 'openid profile email',
      },
      cacheLocation: 'localstorage',
    }),

    provideToastr(),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
