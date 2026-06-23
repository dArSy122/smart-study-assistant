import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

export default function CreateTopicPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <PageHeader
        eyebrow={t('student.createTopicEyebrow')}
        title={t('student.createTopicTitle')}
        description={t('student.createTopicDescription')}
      />

      <form className="form-stack">
        <FormField label={t('common.title')} name="title" placeholder={t('student.titlePlaceholder')} />

        <label className="form-field" htmlFor="language">
          <span>{t('common.topicLanguage')}</span>
          <select id="language" name="language" defaultValue="BG">
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
          />
        </label>

        <Button type="button">{t('common.saveDraft')}</Button>
      </form>
    </Card>
  );
}