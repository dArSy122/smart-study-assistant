import multer from 'multer';
import path from 'path';

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/markdown'
];

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
    const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueName = `${Date.now()}-${safeOriginalName}`;
    callback(null, uniqueName);
  }
});

function fileFilter(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();

  const allowedExtensions = ['.pdf', '.docx', '.pptx', '.txt', '.md'];
  const isAllowedMimeType = allowedMimeTypes.includes(file.mimetype);
  const isAllowedExtension = allowedExtensions.includes(extension);

  if (isAllowedMimeType || isAllowedExtension) {
    callback(null, true);
    return;
  }

  callback(new Error('Unsupported file type. Allowed files: PDF, DOCX, PPTX, TXT, MD.'));
}

export const uploadStudyFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});