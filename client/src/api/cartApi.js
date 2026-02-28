import { productApiClient } from './axiosConfig';
import { cartEndpoints } from '../config/apiEndpoints';

export const cartApi = {
  get: () => productApiClient.get(cartEndpoints.get),

  add: (productId, quantity = 1) =>
    productApiClient.post(cartEndpoints.add, { productId, quantity }),

  update: (productId, quantity) =>
    productApiClient.put(cartEndpoints.update, { productId, quantity }),

  remove: (productId) =>
    productApiClient.delete(cartEndpoints.remove(productId)),

  clear: () => productApiClient.delete(cartEndpoints.clear),

  checkout: () => productApiClient.post(cartEndpoints.checkout),
};
