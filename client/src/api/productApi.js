import { productApiClient } from './axiosConfig';
import { productEndpoints } from '../config/apiEndpoints';

export const productApi = {
  getAll: () => productApiClient.get(productEndpoints.getAll),

  getById: (id) => productApiClient.get(productEndpoints.getById(id)),

  create: (formData) =>
    productApiClient.post(productEndpoints.create, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, formData) =>
    productApiClient.put(productEndpoints.update(id), formData, {
      headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  delete: (id) => productApiClient.delete(productEndpoints.delete(id)),

  byCategory: (params) => productApiClient.get(productEndpoints.byCategory, { params }),

  byPriceRange: (minPrice, maxPrice) =>
    productApiClient.get(productEndpoints.byPriceRange, { params: { minPrice, maxPrice } }),

  paginated: (params) => productApiClient.get(productEndpoints.paginated, { params }),

  search: (body) => productApiClient.post(productEndpoints.search, body),
};
