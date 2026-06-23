import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { createTopic } from '../../services/topicService.js';

export default function CreateTopicPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    language: 'BG',
    originalText: '',
    finalText: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const response = await createTopic({
        ...formData,
        finalText: formData.finalText || formData.originalText
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

        <label className="form-field" htmlFor="originalText">
          <span>{t('common.studyText')}</span>
          <textarea
            id="originalText"
            name="originalText"
            rows="8"
            placeholder={t('student.studyTextPlaceholder')}
            value={formData.originalText}
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