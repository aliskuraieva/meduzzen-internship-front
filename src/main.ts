import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideStore } from '@ngrx/store';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/core/routes/app.routes';
import { appReducer } from './app/core/state/app.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideStore({ testString: appReducer }),
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
  ],
}).catch(err => console.error(err));
