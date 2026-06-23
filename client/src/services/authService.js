import { apiRequest } from './apiClient.js';

export function loginUser(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials
  });
}

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload
  });
}

export function getCurrentUser() {
  return apiRequest('/auth/me', {
    method: 'GET',
    auth: true
  });
}