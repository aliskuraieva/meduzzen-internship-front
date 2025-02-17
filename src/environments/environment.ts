export const environment = {
  production: false,
  apiUrl: process.env['NG_APP_API_URL'],
  dbConnection: process.env['DB_CONNECTION'],
  auth0: {
    domain: process.env['AUTH0_DOMAIN'],
    clientId: process.env['AUTH0_CLIENT_ID'],
    audience: process.env['AUTH0_AUDIENCE']
  }
};
