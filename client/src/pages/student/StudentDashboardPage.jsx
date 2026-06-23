import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';

export default function StudentDashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('student.dashboardEyebrow')}
        title={t('student.dashboardTitle')}
        description={t('student.dashboardDescription')}
        actions={<Button to="/topics/create">{t('common.createTopic')}</Button>}
      />

      <section className="stats-grid">
        <StatCard label={t('student.topics')} value="0" helper={t('student.topicsHelper')} />
        <StatCard label={t('student.generated')} value="0" helper={t('student.generatedHelper')} />
        <StatCard
          label={t('student.quizAttempts')}
          value="0"
          helper={t('student.quizAttemptsHelper')}
        />
        <StatCard
          label={t('student.averageScore')}
          value="0%"
          helper={t('student.averageScoreHelper')}
        />
      </section>

      <Card>
        <h2>{t('student.recentTopics')}</h2>
        <p className="muted-text">{t('student.recentTopicsEmpty')}</p>
      </Card>
    </div>
  );
}