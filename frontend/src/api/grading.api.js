import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export const gradingApi = {
  applyStandard: async (accountId) => {
    const { data } = await apiClient.post(API_ENDPOINTS.APPLY_STANDARD, {
      account_id: accountId,
    });
    return data;
  },

  applyReverse: async (accountId) => {
    const { data } = await apiClient.post(API_ENDPOINTS.APPLY_REVERSE, {
      account_id: accountId,
    });
    return data;
  },
};