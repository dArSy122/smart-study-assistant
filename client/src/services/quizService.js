import { apiRequest } from './apiClient.js';

export function getQuizForTopic(topicId) {
  return apiRequest(`/quiz/topics/${topicId}`, {
    method: 'GET',
    auth: true
  });
}

export function getQuizAttemptsForTopic(topicId) {
  return apiRequest(`/quiz/topics/${topicId}/attempts`, {
    method: 'GET',
    auth: true
  });
}

export function submitQuizForTopic(topicId, answers) {
  return apiRequest(`/quiz/topics/${topicId}/submit`, {
    method: 'POST',
    auth: true,
    body: {
      answers
    }
  });
}