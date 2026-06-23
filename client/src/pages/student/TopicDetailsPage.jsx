import { useTranslation } from 'react-i18next';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

export default function TopicDetailsPage() {
  const { t } = useTranslation();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('student.topicDetailsEyebrow')}
        title={t('student.topicDetailsTitle')}
        description={t('student.topicDetailsDescription')}
        actions={<Button to="/topics/1/quiz">{t('common.startQuiz')}</Button>}
      />

      <section className="two-column-grid">
        <Card>
          <div className="card-title-row">
            <h2>{t('student.finalText')}</h2>
            <Badge variant="default">DRAFT</Badge>
          </div>
          <p className="muted-text">{t('student.finalTextEmpty')}</p>
        </Card>

        <Card>
          <div className="card-title-row">
            <h2>{t('student.aiSummary')}</h2>
            <Badge variant="primary">AI</Badge>
          </div>
          <p className="muted-text">{t('student.aiSummaryEmpty')}</p>
        </Card>
      </section>
    </div>
  );
}