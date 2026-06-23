import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';

export default function StatisticsPage() {
  const { t } = useTranslation();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('student.statsEyebrow')}
        title={t('student.statsTitle')}
        description={t('student.statsDescription')}
      />

      <section className="stats-grid">
        <StatCard
          label={t('student.completedQuizzes')}
          value="0"
          helper={t('student.completedQuizzesHelper')}
        />
        <StatCard
          label={t('student.averageScore')}
          value="0%"
          helper={t('student.averageScoreHelper')}
        />
        <StatCard
          label={t('student.generatedTopics')}
          value="0"
          helper={t('student.generatedTopicsHelper')}
        />
        <StatCard
          label={t('student.archivedTopics')}
          value="0"
          helper={t('student.archivedTopicsHelper')}
        />
      </section>

      <Card>
        <h2>{t('student.chartsArea')}</h2>
        <div className="chart-placeholder">{t('student.chartsPlaceholder')}</div>
      </Card>
    </div>
  );
}