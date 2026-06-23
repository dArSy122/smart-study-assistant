import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import JSZip from 'jszip';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

function normalizeText(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function decodeXmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function stripXmlTags(xml) {
  return decodeXmlEntities(
    xml
      .replace(/<a:br\s*\/>/g, '\n')
      .replace(/<\/a:p>/g, '\n')
      .replace(/<[^>]+>/g, ' ')
  );
}

async function extractTextFromPdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const result = await pdfParse(buffer);

  return normalizeText(result.text);
}

async function extractTextFromDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });

  return normalizeText(result.value);
}

async function extractTextFromPptx(filePath) {
  const buffer = await fs.readFile(filePath);
  const zip = await JSZip.loadAsync(buffer);

  const slideFileNames = Object.keys(zip.files)
    .filter((fileName) => fileName.startsWith('ppt/slides/slide') && fileName.endsWith('.xml'))
    .sort((first, second) => first.localeCompare(second, undefined, { numeric: true }));

  const slideTexts = [];

  for (const slideFileName of slideFileNames) {
    const xml = await zip.files[slideFileName].async('string');
    const text = normalizeText(stripXmlTags(xml));

    if (text) {
      slideTexts.push(text);
    }
  }

  return normalizeText(slideTexts.join('\n\n'));
}

async function extractTextFromPlainFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');

  return normalizeText(content);
}

export async function extractTextFromStudyFile(file) {
  if (!file) {
    throw new Error('File is required.');
  }

  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === '.pdf') {
    return extractTextFromPdf(file.path);
  }

  if (extension === '.docx') {
    return extractTextFromDocx(file.path);
  }

  if (extension === '.pptx') {
    return extractTextFromPptx(file.path);
  }

  if (extension === '.txt' || extension === '.md') {
    return extractTextFromPlainFile(file.path);
  }

  throw new Error('Unsupported file type.');
}