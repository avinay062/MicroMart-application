import { orderApiClient } from './axiosConfig';
import { orderEndpoints } from '../config/apiEndpoints';

export const orderApi = {
  create: (body) => orderApiClient.post(orderEndpoints.create, body),

  getById: (id) => orderApiClient.get(orderEndpoints.getById(id)),

  updateStatus: (id, status) =>
    orderApiClient.put(orderEndpoints.updateStatus(id), { status }),
};
