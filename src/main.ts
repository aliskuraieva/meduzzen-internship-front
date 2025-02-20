import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (window.__env__ && window.__env__['NG_APP_PUBLIC_API_URL']) {
  bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
} else {
  console.error('Environment variables are not defined or loaded properly');
}
