An Angular app built using the Angular CLI.

Clone the repository.

Copy `.env.sample` to `.env` and configure the environment variables.
Descriptions for variables:

Here’s a shortened version of the descriptions for each `.env` variable:

`NODE_ENV`: Specifies the environment (e.g., development, production), adjusting settings like API endpoints or logging.
`API_BASE_URL`: Defines the base URL for the API, differing across environments (dev, prod).
`APP_TITLE`: Sets the app’s title for the browser tab and meta tags.
`ENABLE_DEBUG`: A flag to enable/disable debugging features (useful in development).
`OAUTH_CLIENT_ID` & `OAUTH_CLIENT_SECRET`: Used for OAuth authentication to identify and secure requests.
`GA_TRACKING_ID`: Stores Google Analytics tracking ID for app usage monitoring.
`FEATURE_X_ENABLED`, `FEATURE_Y_ENABLED`: Feature flags to enable/disable specific features without code changes.
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`\*\*: Configures SMTP settings for email sending.
`CACHE_TTL`: Sets the cache duration (in seconds) to reduce backend load.
`SECRET_KEY`: Used for cryptographic operations, e.g., signing JWT tokens (keep secret).
`LOG_LEVEL`: Controls log verbosity (debug, info, warn, error) to manage logging in production.

Install dependencies with `npm install`.

Install dotenv for managing environment variables.

Create a structured file system (components, services, models, etc.).

Set up `.gitignore` to avoid pushing unnecessary files.

Use semantic HTML tags like <header>, <main>, and <footer> in your templates.

Write a start page with a greeting.

Run your Angular app using `ng serve`.
--open: Opens the app in the browser automatically.
--port <port>: Set a custom port.

Compiles the app into static files for deployment `ng build`.
--prod: Builds the production version (optimized/minified).

Runs unit tests using Karma `ng test`.
--watch: Auto-runs tests on code changes.
--code-coverage: Generates a code coverage report.

Runs end-to-end tests using Protractor `ng e2e`.

Generates Angular components, services, modules, etc `ng generate` or `ng g`.

Lints your code using ESLint or TSLint `ng lint`.
--fix: Automatically fixes linting issues.

Adds libraries or packages to your project `ng add`.

Updates Angular and dependencies to the latest version `ng update`.

This guide will help you set up your Angular app and ensure it's structured well, with all necessary configurations in place!

Before running the application in `Docker`, ensure you have the following installed on your machine:

- Docker (latest version)
- Docker Compose (optional, for multi-container setups)

# Build the Docker image
You can build the Docker image with the following command:

`docker-compose build`

This command will use the Dockerfile in the project to create a Docker image that contains your Angular application.

# Run the Docker container
Once the image is built, you can start the container by running:

`docker-compose up`

This will start the container in the foreground. The application will be available at http://localhost:4200.

If you prefer to run the container in detached mode (in the background), use the -d flag:

`docker-compose up -d`

# Access the Application
Once the container is running, you can access the application by navigating to:

http://localhost:4200

The Angular development server will be running inside the Docker container, and the application will be live.

# Stopping the Application
To stop the Docker container, use the following command:

`docker-compose down`

This will stop and remove the container, networks, and volumes associated with the application.

# .dockerignore

The `.dockerignore` file specifies which files and directories should be excluded from the Docker image during the build process. This helps reduce the image size and speeds up the build by avoiding unnecessary files.

