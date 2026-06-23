import fs from 'fs/promises';
import { extractTextFromStudyFile } from '../services/fileTextExtractorService.js';
import { successResponse } from '../utils/apiResponse.js';

async function removeTemporaryFile(filePath) {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(`Could not remove temporary file: ${filePath}`);
  }
}

export async function extractTextFromFile(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('No file was uploaded.');
      error.statusCode = 400;
      throw error;
    }

    const extractedText = await extractTextFromStudyFile(req.file);

    await removeTemporaryFile(req.file.path);

    return successResponse(res, 'Text extracted successfully', {
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      extractedText
    });
  } catch (error) {
    if (req.file?.path) {
      await removeTemporaryFile(req.file.path);
    }

    next(error);
  }
}