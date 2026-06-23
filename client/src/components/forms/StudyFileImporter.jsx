import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button.jsx';
import {
  extractTextFromDocument,
  isImageFile,
  isSupportedStudyFile
} from '../../services/fileImportService.js';
import { extractTextFromImage } from '../../services/ocrService.js';

export default function StudyFileImporter({
  language = 'BG',
  onTextExtracted,
  disabled = false
}) {
  const { t } = useTranslation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [progressText, setProgressText] = useState('');
  const [progressValue, setProgressValue] = useState(0);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFileIsImage = isImageFile(selectedFile);

  useEffect(() => {
    if (!selectedFile || !selectedFileIsImage) {
      setPreviewUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile, selectedFileIsImage]);

  function resetProgress() {
    setError('');
    setProgressText('');
    setProgressValue(0);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    resetProgress();

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!isSupportedStudyFile(file)) {
      setSelectedFile(null);
      setError(t('fileImport.invalidFile'));
      return;
    }

    setSelectedFile(file);
  }

  async function extractFromImage() {
    setProgressText(t('fileImport.ocrStarting'));
    setProgressValue(0);

    const extractedText = await extractTextFromImage(
      selectedFile,
      language,
      (message) => {
        if (message.status) {
          setProgressText(message.status);
        }

        if (typeof message.progress === 'number') {
          setProgressValue(Math.round(message.progress * 100));
        }
      }
    );

    return extractedText;
  }

  async function extractFromDocument() {
    setProgressText(t('fileImport.uploading'));
    setProgressValue(25);

    const response = await extractTextFromDocument(selectedFile);

    setProgressText(t('fileImport.extracting'));
    setProgressValue(80);

    return response.data.extractedText;
  }

  async function handleExtractText() {
    if (!selectedFile) {
      setError(t('fileImport.selectFileFirst'));
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const extractedText = selectedFileIsImage
        ? await extractFromImage()
        : await extractFromDocument();

      if (!extractedText) {
        setError(t('fileImport.noTextFound'));
        return;
      }

      onTextExtracted(extractedText);
      setProgressText(t('fileImport.completed'));
      setProgressValue(100);
    } catch (requestError) {
      setError(requestError.message || t('fileImport.failed'));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="file-import-box">
      <div className="file-import-header">
        <div>
          <strong>{t('fileImport.title')}</strong>
          <span>{t('fileImport.description')}</span>
        </div>
      </div>

      <label className="file-upload">
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.pdf,.docx,.pptx,.txt,.md,image/png,image/jpeg,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/markdown"
          onChange={handleFileChange}
          disabled={disabled || isProcessing}
        />
        <span>{selectedFile ? selectedFile.name : t('fileImport.chooseFile')}</span>
      </label>

      {selectedFile ? (
        <div className="file-import-meta">
          <span>{t('fileImport.selectedFile')}: {selectedFile.name}</span>
          <span>{t('fileImport.fileSize')}: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      ) : null}

      {previewUrl ? (
        <div className="file-preview">
          <img src={previewUrl} alt={t('fileImport.previewAlt')} />
        </div>
      ) : null}

      {progressText ? (
        <div className="file-progress">
          <div className="file-progress-row">
            <span>{progressText}</span>
            <strong>{progressValue}%</strong>
          </div>
          <div className="file-progress-track">
            <div style={{ width: `${progressValue}%` }} />
          </div>
        </div>
      ) : null}

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="file-import-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={handleExtractText}
          disabled={disabled || isProcessing || !selectedFile}
        >
          {isProcessing ? t('fileImport.processing') : t('fileImport.extract')}
        </Button>
      </div>
    </div>
  );
}