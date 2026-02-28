# MicroMart Client (React)

React frontend for MicroMart, wired to User, Product (and Cart), Order, and Inventory services.

## Structure

- **`src/config/`** – Centralised config
  - `env.js` – Reads `REACT_APP_*` from `.env`
  - `apiEndpoints.js` – API path constants (no base URLs)
- **`src/api/`** – API layer
  - `axiosConfig.js` – Axios instances (user, product, order, inventory) with `withCredentials: true`
  - `userApi.js`, `productApi.js`, `cartApi.js`, `orderApi.js`, `inventoryApi.js` – Service clients
- **`src/pages/`** – Route-level screens
  - `AuthPage` – Sign in / Sign up
  - `ProductsPage` – List and create products
  - `ProductDetailPage` – Product detail and add to cart
  - `CartPage` – Cart and checkout
  - `OrdersPage` – Order lookup by ID
- **`src/components/`** – Reusable UI (Header, Footer, ProductCard, ProductForm, ProtectedRoute)
- **`src/context/UserContext.js`** – Auth state (user, setUser)

## Environment

1. Copy `client/.env.example` to `client/.env`.
2. Set base URLs for each service (defaults point to localhost and the ports used by the backend).

```env
REACT_APP_API_USER_URL=http://localhost:3004
REACT_APP_API_PRODUCT_URL=http://localhost:30011
REACT_APP_API_ORDER_URL=http://localhost:3001
REACT_APP_API_INVENTORY_URL=http://localhost:3003
```

## Run

```bash
npm start
```

Ensure the User and Product (and optionally Order, Inventory) services are running so the client can call their APIs.

## Routes

| Path | Protected | Description |
|------|-----------|-------------|
| `/` | No | Sign in / Sign up |
| `/products` | Yes | Product list and create |
| `/products/:id` | Yes | Product detail, add to cart |
| `/cart` | Yes | Cart and checkout |
| `/orders` | Yes | Order lookup by ID |
