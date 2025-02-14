import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/core/routes/app.routes';
import { provideStore } from '@ngrx/store';
import { appReducer } from './app/core/state/app.reducer';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideStore({ testString: appReducer }),
    provideHttpClient(),
    AuthModule,
    {
      provide: 'AuthConfig',
      useValue: {
        domain: environment.auth0.domain,
        clientId: environment.auth0.clientId,
        authorizationParams: {
          redirect_uri: window.location.origin,
        },
      },
    },
  ]
}).catch(err => console.error(err));
