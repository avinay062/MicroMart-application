import { userApiClient } from './axiosConfig';
import { userEndpoints } from '../config/apiEndpoints';

export const userApi = {
  signup: (data) =>
    userApiClient.post(userEndpoints.signup, {
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      password: data.password,
    }),

  signin: (data) =>
    userApiClient.post(userEndpoints.signin, {
      emailId: data.emailId,
      password: data.password,
    }),

  logout: () => userApiClient.post(userEndpoints.logout),

  validateAuth: () => userApiClient.post(userEndpoints.validateAuth),

  getAll: () => userApiClient.get(userEndpoints.getAll),

  getById: (id) => userApiClient.get(userEndpoints.getById(id)),
};
