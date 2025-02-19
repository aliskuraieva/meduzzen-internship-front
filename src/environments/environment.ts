export const environment = {
  production: true,
  apiUrl: process.env['NG_APP_API_URL'],
  auth0: {
    domain: process.env['AUTH0_DOMAIN'],
    clientId: process.env['AUTH0_CLIENT_ID'],
    audience: process.env['AUTH0_AUDIENCE']
  }
};
