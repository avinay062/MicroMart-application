/**
 * API endpoint paths per service (no base URL).
 * Base URLs come from config/env.js; axios instances are in api/axiosConfig.js.
 */
export const userEndpoints = {
  signup: '/api/users/signup',
  signin: '/api/users/signin',
  logout: '/api/users/logout',
  validateAuth: '/api/users/auth/validate',
  getAll: '/api/users/',
  getById: (id) => `/api/users/getUser/${id}`,
};

export const productEndpoints = {
  create: '/api/products/create',
  getAll: '/api/products/getAllProducts',
  getById: (id) => `/api/products/getProduct/${id}`,
  update: (id) => `/api/products/update/${id}`,
  delete: (id) => `/api/products/delete/${id}`,
  byCategory: '/api/products/products-by-category',
  byPriceRange: '/api/products/products-by-price-range',
  countByPriceRange: '/api/products/count-by-price-range',
  paginated: '/api/products/paginated',
  search: '/api/products/search-product',
};

export const cartEndpoints = {
  add: '/api/cart/add',
  get: '/api/cart/',
  update: '/api/cart/update',
  remove: (productId) => `/api/cart/remove/${productId}`,
  clear: '/api/cart/clear',
  checkout: '/api/cart/checkout',
};

export const orderEndpoints = {
  create: '/orders',
  getById: (id) => `/orders/${id}`,
  updateStatus: (id) => `/orders/${id}/status`,
};

export const inventoryEndpoints = {
  get: (productId) => `/inventory/${productId}`,
  update: '/inventory/update',
};
