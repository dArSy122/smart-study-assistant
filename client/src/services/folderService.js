import { apiRequest } from './apiClient.js';

export function getFolders() {
  return apiRequest('/folders', {
    method: 'GET',
    auth: true
  });
}

export function createFolder(payload) {
  return apiRequest('/folders', {
    method: 'POST',
    auth: true,
    body: payload
  });
}

export function getFolderById(id) {
  return apiRequest(`/folders/${id}`, {
    method: 'GET',
    auth: true
  });
}

export function updateFolder(id, payload) {
  return apiRequest(`/folders/${id}`, {
    method: 'PUT',
    auth: true,
    body: payload
  });
}

export function deleteFolder(id) {
  return apiRequest(`/folders/${id}`, {
    method: 'DELETE',
    auth: true
  });
}