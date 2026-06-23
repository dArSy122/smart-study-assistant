import { apiRequest } from './apiClient.js';

export function extractTextFromDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest('/files/extract-text', {
    method: 'POST',
    auth: true,
    body: formData
  });
}

export function isImageFile(file) {
  return file?.type?.startsWith('image/');
}

export function isSupportedDocumentFile(file) {
  const extension = file?.name?.split('.').pop()?.toLowerCase();

  return ['pdf', 'docx', 'pptx', 'txt', 'md'].includes(extension);
}

export function isSupportedStudyFile(file) {
  return isImageFile(file) || isSupportedDocumentFile(file);
}