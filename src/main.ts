import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideStore } from '@ngrx/store';
import { appReducer } from './app/state/app.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideStore({ app: appReducer })
  ]
}).catch(err => console.error(err));
