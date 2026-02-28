const path = require('path');
const dotenv = require('dotenv');

// Load env from services/api-gateway/environment/.env (preferred)
dotenv.config({ path: path.join(__dirname, 'environment/.env') });
// Allow local overrides (not committed)
dotenv.config({ path: path.join(__dirname, 'environment/.env.local'), override: true });
// Fallback to a .env in the gateway root if present
dotenv.config();

const gateway = require('express-gateway');

// express-gateway exports a factory; .run() exists on the returned instance
gateway()
  .load(path.join(__dirname, 'config'))
  .run()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Express Gateway is running');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Express Gateway failed to start', err);
    process.exit(1);
  });

