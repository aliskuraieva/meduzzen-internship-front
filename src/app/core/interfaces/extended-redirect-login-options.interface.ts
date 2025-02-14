import { RedirectLoginOptions } from '@auth0/auth0-angular';

export interface ExtendedRedirectLoginOptions extends RedirectLoginOptions<{}> {
  screen_hint?: string;
}
