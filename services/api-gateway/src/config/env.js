const path = require('path');
const dotenv = require('dotenv');

// Load env from services/api-gateway/environment/.env (preferred)
dotenv.config({ path: path.join(__dirname, '../../environment/.env') });
// Allow local overrides (not committed)
dotenv.config({ path: path.join(__dirname, '../../environment/.env.local'), override: true });
// Fallback to a .env in the gateway root if present
dotenv.config();

const env = {
  port: Number(process.env.PORT || 8080),
  clientOrigin: process.env.CLIENT_ORIGIN || true,
  jwtSecret: process.env.JWT_SECRET,
  services: {
    user: process.env.USER_SERVICE_URL || 'http://localhost:3004',
    product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:30011',
    order: process.env.ORDER_SERVICE_URL || 'http://localhost:3001',
    inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003',
  },
};

module.exports = env;

