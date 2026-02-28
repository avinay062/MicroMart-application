import axios from 'axios';
import env from '../config/env';

/**
 * Axios instances per service. All use credentials (cookies) for auth.
 */
export const userApiClient = axios.create({
  baseURL: env.api.base,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const productApiClient = axios.create({
  baseURL: env.api.base,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const orderApiClient = axios.create({
  baseURL: env.api.base,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const inventoryApiClient = axios.create({
  baseURL: env.api.base,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Optional: global response interceptor for 401 (e.g. redirect to login).
 * Can be enhanced to use a callback from UserContext for logout.
 */
const attachResponseInterceptor = (client, onUnauthorized) => {
  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401 && typeof onUnauthorized === 'function') {
        onUnauthorized();
      }
      return Promise.reject(err);
    }
  );
};

export const setUnauthorizedHandler = (callback) => {
  [userApiClient, productApiClient, orderApiClient, inventoryApiClient].forEach((c) =>
    attachResponseInterceptor(c, callback)
  );
};
