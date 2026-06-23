import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StudyFileImporter from '../../components/forms/StudyFileImporter.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { getFolders } from '../../services/folderService.js';
import { createTopic } from '../../services/topicService.js';

export default function CreateTopicPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialFolderId = searchParams.get('folderId') || '';

  const [folders, setFolders] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    language: 'BG',
    folderId: initialFolderId,
    originalText: '',
    ocrText: '',
    finalText: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFoldersLoading, setIsFoldersLoading] = useState(true);

  useEffect(() => {
    async function loadFolders() {
      try {
        const response = await getFolders();
        setFolders(response.data.folders);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsFoldersLoading(false);
      }
    }

    loadFolders();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  function handleExtractedText(extractedText) {
    setFormData((currentData) => ({
      ...currentData,
      ocrText: extractedText,
      finalText: currentData.finalText || extractedText
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const response = await createTopic({
        ...formData,
        folderId: formData.folderId ? Number(formData.folderId) : null,
        finalText: formData.finalText || formData.originalText || formData.ocrText
      });

      navigate(`/topics/${response.data.topic.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <PageHeader
        eyebrow={t('student.createTopicEyebrow')}
        title={t('student.createTopicTitle')}
        description={t('student.createTopicDescription')}
      />

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <form className="form-stack" onSubmit={handleSubmit}>
        <FormField
          label={t('common.title')}
          name="title"
          placeholder={t('student.titlePlaceholder')}
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label className="form-field" htmlFor="language">
          <span>{t('common.topicLanguage')}</span>
          <select id="language" name="language" value={formData.language} onChange={handleChange}>
            <option value="BG">{t('common.bulgarian')}</option>
            <option value="EN">{t('common.english')}</option>
          </select>
        </label>

        <label className="form-field" htmlFor="folderId">
          <span>{t('library.folder')}</span>
          <select
            id="folderId"
            name="folderId"
            value={formData.folderId}
            onChange={handleChange}
            disabled={isFoldersLoading}
          >
            <option value="">{t('library.noFolder')}</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </label>

        <StudyFileImporter
          language={formData.language}
          onTextExtracted={handleExtractedText}
          disabled={isLoading}
        />

        <label className="form-field" htmlFor="originalText">
          <span>{t('common.studyText')}</span>
          <textarea
            id="originalText"
            name="originalText"
            rows="7"
            placeholder={t('student.studyTextPlaceholder')}
            value={formData.originalText}
            onChange={handleChange}
          />
        </label>

        <label className="form-field" htmlFor="ocrText">
          <span>{t('fileImport.extractedText')}</span>
          <textarea
            id="ocrText"
            name="ocrText"
            rows="7"
            placeholder={t('fileImport.extractedTextPlaceholder')}
            value={formData.ocrText}
            onChange={handleChange}
          />
        </label>

        <label className="form-field" htmlFor="finalText">
          <span>{t('student.finalText')}</span>
          <textarea
            id="finalText"
            name="finalText"
            rows="8"
            placeholder={t('student.finalTextPlaceholder')}
            value={formData.finalText}
            onChange={handleChange}
          />
        </label>

        <Button type="submit">{isLoading ? t('common.loading') : t('common.saveDraft')}</Button>
      </form>
    </Card>
  );
}