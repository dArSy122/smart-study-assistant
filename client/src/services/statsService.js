import { apiRequest } from './apiClient.js';

export function getMyStats() {
  return apiRequest('/stats/me', {
    method: 'GET',
    auth: true
  });
}