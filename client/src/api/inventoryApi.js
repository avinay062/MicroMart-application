import { inventoryApiClient } from './axiosConfig';
import { inventoryEndpoints } from '../config/apiEndpoints';

export const inventoryApi = {
  get: (productId) => inventoryApiClient.get(inventoryEndpoints.get(productId)),

  update: (productId, quantity) =>
    inventoryApiClient.post(inventoryEndpoints.update, { productId, quantity }),
};
