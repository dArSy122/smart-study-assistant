import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import StudyFileImporter from '../../components/forms/StudyFileImporter.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import {
  archiveTopic,
  deleteTopic,
  getTopicById,
  updateTopic
} from '../../services/topicService.js';

export default function TopicDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    language: 'BG',
    originalText: '',
    ocrText: '',
    finalText: '',
    status: 'DRAFT'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadTopic() {
      try {
        const response = await getTopicById(id);
        const loadedTopic = response.data.topic;

        setTopic(loadedTopic);
        setFormData({
          title: loadedTopic.title || '',
          language: loadedTopic.language || 'BG',
          originalText: loadedTopic.originalText || '',
          ocrText: loadedTopic.ocrText || '',
          finalText: loadedTopic.finalText || '',
          status: loadedTopic.status || 'DRAFT'
        });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadTopic();
  }, [id]);

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

  async function handleSave(event) {
    event.preventDefault();

    setError('');
    setMessage('');
    setIsSaving(true);

    try {
      const response = await updateTopic(id, formData);

      setTopic(response.data.topic);
      setMessage(t('student.topicSaved'));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchive() {
    setError('');
    setMessage('');

    try {
      const response = await archiveTopic(id);

      setTopic(response.data.topic);
      setFormData((currentData) => ({
        ...currentData,
        status: response.data.topic.status
      }));
      setMessage(t('student.topicArchived'));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(t('student.deleteConfirm'));

    if (!confirmed) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await deleteTopic(id);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (isLoading) {
    return (
      <Card>
        <p className="muted-text">{t('common.loading')}</p>
      </Card>
    );
  }

  if (!topic) {
    return (
      <Card>
        <PageHeader
          eyebrow={t('student.topicDetailsEyebrow')}
          title={t('notFound.title')}
          description={error || t('notFound.description')}
        />
      </Card>
    );
  }

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('student.topicDetailsEyebrow')}
        title={topic.title}
        description={t('student.topicDetailsDescription')}
        actions={
          <div className="page-actions">
            <Button to={`/topics/${id}/quiz`}>{t('common.startQuiz')}</Button>
            <Button type="button" variant="secondary" onClick={handleArchive}>
              {t('common.archive')}
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete}>
              {t('common.delete')}
            </Button>
          </div>
        }
      />

      {message ? <div className="alert alert-success">{message}</div> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      <section className="two-column-grid">
        <Card>
          <div className="card-title-row">
            <h2>{t('student.finalText')}</h2>
            <Badge variant={formData.status === 'ARCHIVED' ? 'danger' : 'primary'}>
              {formData.status}
            </Badge>
          </div>

          <form className="form-stack" onSubmit={handleSave}>
            <label className="form-field" htmlFor="title">
              <span>{t('common.title')}</span>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-field" htmlFor="language">
              <span>{t('common.topicLanguage')}</span>
              <select id="language" name="language" value={formData.language} onChange={handleChange}>
                <option value="BG">{t('common.bulgarian')}</option>
                <option value="EN">{t('common.english')}</option>
              </select>
            </label>

            <StudyFileImporter
              language={formData.language}
              onTextExtracted={handleExtractedText}
              disabled={isSaving}
            />

            <label className="form-field" htmlFor="originalText">
              <span>{t('common.studyText')}</span>
              <textarea
                id="originalText"
                name="originalText"
                rows="6"
                value={formData.originalText}
                onChange={handleChange}
              />
            </label>

            <label className="form-field" htmlFor="ocrText">
              <span>{t('fileImport.extractedText')}</span>
              <textarea
                id="ocrText"
                name="ocrText"
                rows="6"
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
                value={formData.finalText}
                onChange={handleChange}
              />
            </label>

            <Button type="submit">{isSaving ? t('common.loading') : t('common.save')}</Button>
          </form>
        </Card>

        <Card>
          <div className="card-title-row">
            <h2>{t('student.aiSummary')}</h2>
            <Badge variant="primary">AI</Badge>
          </div>

          {topic.aiResult ? (
            <div className="ai-preview">
              <p>{topic.aiResult.summary}</p>
            </div>
          ) : (
            <p className="muted-text">{t('student.aiSummaryEmpty')}</p>
          )}

          <div className="details-meta">
            <span>ID: {topic.id}</span>
            <span>{t('common.language')}: {topic.language}</span>
            <span>{t('common.createdAt')}: {new Date(topic.createdAt).toLocaleString()}</span>
          </div>
        </Card>
      </section>
    </div>
  );
}