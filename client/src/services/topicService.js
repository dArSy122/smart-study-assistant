import { apiRequest } from './apiClient.js';

export function getTopics() {
  return apiRequest('/topics', {
    method: 'GET',
    auth: true
  });
}

export function getTopicById(id) {
  return apiRequest(`/topics/${id}`, {
    method: 'GET',
    auth: true
  });
}

export function createTopic(payload) {
  return apiRequest('/topics', {
    method: 'POST',
    auth: true,
    body: payload
  });
}

export function updateTopic(id, payload) {
  return apiRequest(`/topics/${id}`, {
    method: 'PUT',
    auth: true,
    body: payload
  });
}

export function archiveTopic(id) {
  return apiRequest(`/topics/${id}/archive`, {
    method: 'PATCH',
    auth: true
  });
}

export function deleteTopic(id) {
  return apiRequest(`/topics/${id}`, {
    method: 'DELETE',
    auth: true
  });
}