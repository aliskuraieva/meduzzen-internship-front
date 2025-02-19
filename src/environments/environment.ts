export const environment = {
  production: false,
  apiUrl: process.env['NG_APP_PUBLIC_API_URL'],
  auth0: {
    domain: process.env['NG_APP_PUBLIC_AUTH0_DOMAIN'],
    clientId: process.env['NG_APP_PUBLIC_AUTH0_CLIENT_ID'],
    audience: process.env['NG_APP_PUBLIC_AUTH0_AUDIENCE']
  }
};
