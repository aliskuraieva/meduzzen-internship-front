import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/core/routes/app.routes';
import { provideStore } from '@ngrx/store';
import { appReducer } from './app/core/state/app.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideStore({ testString: appReducer }),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
