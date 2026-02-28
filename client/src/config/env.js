/**
 * Centralized environment configuration.
 * All REACT_APP_* variables must be set in .env (see .env.example).
 */
const env = {
  api: {
    // API Gateway base URL. All service clients should call the gateway.
    base: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  },
};

export default env;
