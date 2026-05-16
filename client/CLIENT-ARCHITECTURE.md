# MicroMart Client Technical Architecture

## 1. Purpose and Scope

This document describes the frontend architecture of the MicroMart client application in detail:

- Runtime composition and request flow
- Folder-by-folder responsibilities
- Component and page behavior
- Authentication and route protection lifecycle
- State management model (Context + Redux)
- Testing surface and current gaps
- Operational commands and environment setup

Scope is limited to the client application under client/src.

## 2. Technology Stack

- React 19 for UI rendering
- React Router v6 for client-side routing
- Axios for API requests
- React Context for session user and theme state
- Redux Toolkit for product slice scaffolding
- Tailwind CSS for styling and dark mode classes
- Jest + Testing Library for unit/component tests

## 3. High-Level Runtime Architecture

Application bootstrap chain:

1. index.js mounts React root.
2. Redux Provider wraps App with global store access.
3. App applies ThemeProvider and UserProvider.
4. Router renders persistent shell (Header, Footer) and route content.
5. Unauthorized handler registers global API 401 interception.

Logical layers:

- Presentation layer: pages and reusable components
- State layer: UserContext, ThemeContext, optional Redux store
- API layer: Axios clients and service modules
- Config layer: env and endpoint constants

## 4. Source Tree and Responsibilities

### 4.1 api/

Purpose: centralized HTTP abstraction for gateway-backed service calls.

Files:

- axiosConfig.js
  - Creates four Axios instances: userApiClient, productApiClient, orderApiClient, inventoryApiClient.
  - All clients share base URL from config/env.js.
  - withCredentials is enabled to include auth cookies in all requests.
  - Exposes setUnauthorizedHandler(callback), attaching a 401 response interceptor to all clients.

- userApi.js
  - signup, signin, logout, validateAuth, getAll, getById.
  - Handles payload normalization for signin/signup requests.

- productApi.js
  - Product CRUD and discovery operations.
  - Supports multipart/form-data for create/update with image upload.
  - Includes filtering, price-range, pagination, and search operations.

- cartApi.js
  - Cart operations (get/add/update/remove/clear/checkout).
  - Uses productApiClient because cart routes are served under /api/cart via gateway mapping.

- orderApi.js
  - create, getById, updateStatus operations.

- inventoryApi.js
  - get by product and update quantity operations.

- index.js
  - Barrel exports all API clients and modules.

### 4.2 config/

Purpose: central runtime configuration and URL contracts.

Files:

- env.js
  - Defines env.api.base from REACT_APP_API_BASE_URL with fallback http://localhost:8080.
  - Single source of truth for API gateway base URL.

- apiEndpoints.js
  - Defines path constants for user, product, cart, order, inventory.
  - Keeps route path strings out of pages/components.

### 4.3 context/

Purpose: cross-cutting UI/application state.

Files:

- UserContext.js
  - Stores user and setUser.
  - User null means unauthenticated.

- ThemeContext.js
  - Stores isDarkMode, toggleTheme, setTheme.
  - Reads initial theme from localStorage or system preference.
  - Writes dark class to document root and persists selection.

### 4.4 components/

Purpose: reusable view and behavior units used across pages.

Core components:

- Header.js
  - Brand/navigation shell.
  - Renders Products, Cart, Orders links only when user exists.
  - Provides theme toggle and user dropdown logout action.

- Footer.js
  - Static footer rendered globally.

- ProtectedRoute.js
  - Route gate: if user missing, redirects to root login page.
  - Preserves original location in route state.

- ProductCard.js
  - Product summary card used in grid list.
  - Navigates to product detail route.

- ProductForm.js
  - Product creation form with file upload support.
  - Emits success callback to parent page.

Legacy/demo components:

- AuthForm.js (legacy alternative auth implementation, not active route entry)
- Parent.js and Child.js (React hook demonstration components, not part of main flow)

Tests:

- components/__tests__/ProtectedRoute.test.jsx validates unauthenticated redirect and authenticated rendering.

### 4.5 pages/

Purpose: route-level screens and feature orchestration.

Files:

- AuthPage.js
  - Public route for signin/signup.
  - Uses userApi for auth requests.
  - On successful signin sets user context and navigates to intended route.

- ProductsPage.js
  - Fetches product list from productApi.
  - Switches between list mode and create-product mode.
  - Uses ProductCard and ProductForm.

- ProductDetailPage.js
  - Fetches product by route param id.
  - Supports quantity selection and add-to-cart action.

- CartPage.js
  - Loads cart, updates quantity, removes item, clears cart, and checkout.
  - Handles different cart payload shapes defensively.

- OrdersPage.js
  - Order lookup by ID.
  - Displays service response payload in a developer-friendly block.

- pages/__tests__/
  - Currently empty.

### 4.6 store/

Purpose: Redux state foundation (partially used).

Files:

- store.js
  - Configures Redux store with products reducer.

- slices/productSlice.js
  - products/loading/error state and reducers:
    - fetchProductsStart
    - fetchProductsSuccess
    - fetchProductsFailure

- selectors/productSelectors.js
  - selectProducts
  - selectLoading
  - selectError

- sagas/
  - Currently empty.

Note: Current pages rely mainly on local component state and Context, with Redux scaffold ready for future expansion.

### 4.7 Styling and Test Setup

- index.css
  - Tailwind base/components/utilities imports.
  - Base dark/light application styles for body and form controls.

- setupTests.js
  - Imports @testing-library/jest-dom custom assertions.

## 5. Route and Component Flow

Route map:

- / -> AuthPage (public)
- /products -> ProtectedRoute -> ProductsPage
- /products/:id -> ProtectedRoute -> ProductDetailPage
- /cart -> ProtectedRoute -> CartPage
- /orders -> ProtectedRoute -> OrdersPage
- /main -> redirect to /products
- * -> redirect to /

Shell behavior:

- Header and Footer always render around route content.
- Main content is lazy-loaded with a suspense fallback.

## 6. Authentication and Authorization Lifecycle

Primary mechanism:

- Backend sets auth token in cookie.
- Axios withCredentials sends cookie automatically.
- Gateway validates token and forwards authorized requests.

Client flow:

1. User submits signin on AuthPage.
2. userApi.signin resolves and user context is set.
3. Protected routes become accessible.
4. If any API call returns 401:
   - interceptor invokes registered unauthorized handler
   - handler clears user context
   - app navigates to root login route

Logout flow:

1. Header triggers userApi.logout.
2. Regardless of API success/failure, user context is cleared.
3. App redirects to root route.

## 7. API Request Lifecycle

Generic request chain:

1. Page/component invokes api module method.
2. API method reads endpoint path from config/apiEndpoints.js.
3. Axios client sends request to env.api.base.
4. Browser includes credentials cookie.
5. Response returns to caller.
6. Component handles loading/success/error locally.
7. Global 401 path is handled by interceptor callback.

Example: product detail to cart

- ProductDetailPage loads productApi.getById(id).
- User sets quantity.
- cartApi.add(productId, quantity) sends POST to /api/cart/add.
- UI shows success/failure message without route change.

## 7.1 End-to-End User Journey Flow

1. USER ENTERS / (AuthPage)
  - Not logged in -> AuthPage renders
  - User fills email + password
  - Clicks Sign in

2. SIGNIN PROCESS
  - AuthPage calls: userApi.signin({ emailId, password })
  - API sends: POST http://localhost:8080/api/users/signin
    (goes through gateway -> user-service)
  - Response: user object { id, firstName, lastName, emailId, ... }
  - setUser(userData) -> UserContext updated

3. PROTECTED ROUTE ACTIVATION
  - UserContext.user is now set
  - useEffect in AuthPage triggers
  - navigate('/products', { replace: true })
  - React Router switches to ProductsPage

4. PRODUCTS PAGE LOADS
  - ProtectedRoute checks: user exists? yes, render ProductsPage
  - ProductsPage mounts
  - useEffect fires: productApi.getAll()
    - GET http://localhost:8080/api/products/getAllProducts
    - withCredentials: true -> browser auto-includes cookie with JWT
    - Gateway validates JWT from cookie
    - Gateway forwards to product-service
  - Response: array of products
  - setProducts(array) -> page re-renders with ProductCard grid

5. USER CLICKS PRODUCT CARD
  - ProductCard is a Link to /products/{id}
  - React Router renders ProductDetailPage with id param
  - ProductDetailPage useEffect runs
  - productApi.getById(id) fetches single product
  - Image, name, price, description rendered

6. USER ADDS TO CART
  - Enters quantity (default 1)
  - Clicks Add to cart
  - ProductDetailPage calls: cartApi.add(productId, quantity)
  - POST http://localhost:8080/api/cart/add
  - Gateway routes to product-service (cart is handled by product-service)
  - Response: success message
  - setCartMessage('Added to cart.')

7. USER GOES TO CART
  - Clicks Cart link in Header
  - React Router navigates to /cart
  - CartPage mounts
  - cartApi.get() fetches cart contents
  - Displays items with quantity controls
  - User can: update qty, remove item, clear, or checkout

8. USER CHECKS OUT
  - Clicks Checkout
  - cartApi.checkout() called
  - POST http://localhost:8080/api/cart/checkout
  - Backend creates order, clears cart
  - setCheckoutResult(response) -> shows success

9. USER LOGS OUT
  - Clicks user avatar -> dropdown
  - Clicks Logout
  - Header calls: userApi.logout()
  - POST http://localhost:8080/api/users/logout
  - Backend clears cookie
  - Header calls: setUser(null)
  - UserContext.user becomes null
  - Protected routes fail ProtectedRoute check
  - Redirects to / (AuthPage)

## 8. State Management Model

Current strategy is hybrid:

- Context for global cross-cutting state:
  - User session identity
  - Theme preference

- Local component state for feature-level state:
  - Form values
  - Loading flags
  - Inline errors
  - Temporary UI messages

- Redux present as platform layer:
  - Product slice and selectors exist
  - Not yet the primary data source for pages

Benefits:

- Low complexity for current app size
- Incremental path to larger Redux adoption if needed

## 9. Testing Surface

Configured test tooling:

- Jest runner via npm test
- Testing Library DOM matchers via setupTests

Current tests:

- ProtectedRoute behavior test exists.

Current gaps:

- No page-level tests for auth, product list, cart, or order lookup flows.
- No API module unit tests.
- Empty pages test directory indicates planned but not implemented coverage.

## 10. Environment and Runbook

Scripts from package.json:

- npm start: react-scripts start
- npm build: react-scripts build
- npm test: jest --runInBand

Required environment:

- REACT_APP_API_BASE_URL

Recommended local setup:

1. Ensure backend gateway is running on configured base URL.
2. Start client with npm start.
3. Validate signin and protected navigation.

## 11. Known Inconsistencies and Cleanup Opportunities

1. Documentation drift:
   - Existing README environment block mentions per-service URLs, while runtime code uses a single REACT_APP_API_BASE_URL.

2. Legacy component overlap:
   - AuthForm exists but AuthPage is active route implementation.

3. Interceptor attachment model:
   - setUnauthorizedHandler adds interceptors when called; ensure it is initialized once to avoid duplicate handlers.

4. Redux underutilization:
   - Product slice exists but pages still fetch and manage product data locally.

5. Test coverage imbalance:
   - Route guard tested; core business pages are untested.

## 12. Practical Extension Guidance

When adding a new feature:

1. Add endpoint path in config/apiEndpoints.js.
2. Add API method in matching module under api/.
3. Implement page/component using existing loading/error patterns.
4. Decide state placement:
   - Context for global cross-cutting state
   - Redux for shared domain state
   - Local state for page-local interactions
5. Add tests in relevant __tests__ location.

This keeps the client architecture consistent and maintainable as features grow.
