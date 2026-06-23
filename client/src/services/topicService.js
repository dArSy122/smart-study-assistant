import { apiRequest } from './apiClient.js';

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}

export function getTopics(params = {}) {
  return apiRequest(`/topics${buildQuery(params)}`, {
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

export function restoreTopic(id) {
  return apiRequest(`/topics/${id}/restore`, {
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