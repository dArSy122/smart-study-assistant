import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import StudyFileImporter from '../../components/forms/StudyFileImporter.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { generateAiForTopic } from '../../services/aiService.js';
import { getFolders } from '../../services/folderService.js';
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
  const [folders, setFolders] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    language: 'BG',
    folderId: '',
    originalText: '',
    ocrText: '',
    finalText: '',
    status: 'DRAFT'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFoldersLoading, setIsFoldersLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiProvider, setAiProvider] = useState('');

  useEffect(() => {
    async function loadTopicAndFolders() {
      try {
        const [topicResponse, foldersResponse] = await Promise.all([
          getTopicById(id),
          getFolders()
        ]);

        const loadedTopic = topicResponse.data.topic;

        setTopic(loadedTopic);
        setFolders(foldersResponse.data.folders);

        setFormData({
          title: loadedTopic.title || '',
          language: loadedTopic.language || 'BG',
          folderId: loadedTopic.folderId ? String(loadedTopic.folderId) : '',
          originalText: loadedTopic.originalText || '',
          ocrText: loadedTopic.ocrText || '',
          finalText: loadedTopic.finalText || '',
          status: loadedTopic.status || 'DRAFT'
        });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
        setIsFoldersLoading(false);
      }
    }

    loadTopicAndFolders();
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
      await updateTopic(id, {
        ...formData,
        folderId: formData.folderId ? Number(formData.folderId) : null
      });

      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/library');
      }
    } catch (requestError) {
      setError(requestError.message);
      setIsSaving(false);
    }
  }

  async function handleGenerateAi() {
    setError('');
    setMessage('');
    setIsGenerating(true);

    try {
      await updateTopic(id, {
        ...formData,
        folderId: formData.folderId ? Number(formData.folderId) : null
      });

      const response = await generateAiForTopic(id);
      const updatedTopic = response.data.topic;
      setAiProvider(response.data.provider || '');

      setTopic(updatedTopic);
      setFormData((currentData) => ({
        ...currentData,
        status: updatedTopic.status || 'GENERATED'
      }));

      setMessage(t('ai.generatedSuccessfully'));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
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

  const aiResult = topic?.aiResult;

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
            <Button type="button" onClick={handleGenerateAi} disabled={isGenerating}>
              {isGenerating ? t('ai.generating') : t('ai.generate')}
            </Button>
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

            <label className="form-field" htmlFor="folderId">
              <span>{t('library.folder')}</span>
              <select
                id="folderId"
                name="folderId"
                value={formData.folderId}
                onChange={handleChange}
                disabled={isFoldersLoading || isSaving}
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
            <h2>{t('ai.title')}</h2>
            <Badge variant="primary">{aiProvider || 'AI'}</Badge>
          </div>

          {!aiResult ? (
            <p className="muted-text">{t('ai.empty')}</p>
          ) : (
            <div className="ai-result-stack">
              <section>
                <h3>{t('ai.summary')}</h3>
                <p>{aiResult.summary}</p>
              </section>

              <section>
                <h3>{t('ai.keyTerms')}</h3>
                <div className="ai-chip-list">
                  {(aiResult.keyTerms || []).map((item, index) => (
                    <span className="ai-chip" key={`${item.term}-${index}`}>
                      {item.term}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3>{t('ai.studyPlan')}</h3>
                <ol className="ai-list">
                  {(aiResult.studyPlan || []).map((item, index) => (
                    <li key={`${item.title}-${index}`}>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h3>{t('ai.flashcards')}</h3>
                <div className="flashcard-preview-grid">
                  {(aiResult.flashcardsJson || []).slice(0, 4).map((card, index) => (
                    <div className="flashcard-preview" key={`${card.front}-${index}`}>
                      <strong>{card.front}</strong>
                      <span>{card.back}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3>{t('ai.quiz')}</h3>
                <p className="muted-text">
                  {(aiResult.quizJson || []).length} {t('ai.quizQuestions')}
                </p>
              </section>
            </div>
          )}

          <div className="details-meta">
            <span>ID: {topic.id}</span>
            <span>{t('common.language')}: {topic.language}</span>
            <span>{t('library.folder')}: {topic.folder?.name || t('library.noFolder')}</span>
            <span>{t('common.createdAt')}: {new Date(topic.createdAt).toLocaleString()}</span>
          </div>
        </Card>
      </section>
    </div>
  );
}