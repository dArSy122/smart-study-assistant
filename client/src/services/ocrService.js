import { recognize } from 'tesseract.js';

export function getTesseractLanguage(topicLanguage) {
  if (topicLanguage === 'BG') {
    return 'bul';
  }

  if (topicLanguage === 'EN') {
    return 'eng';
  }

  return 'eng';
}

export async function extractTextFromImage(file, topicLanguage, onProgress) {
  if (!file) {
    throw new Error('Image file is required.');
  }

  const tesseractLanguage = getTesseractLanguage(topicLanguage);

  const result = await recognize(file, tesseractLanguage, {
    logger: (message) => {
      if (typeof onProgress === 'function') {
        onProgress(message);
      }
    }
  });

  return result.data.text.trim();
}