import { apiRequest } from './apiClient.js';

export function generateAiForTopic(topicId) {
  return apiRequest(`/ai/topics/${topicId}/generate`, {
    method: 'POST',
    auth: true
  });
}