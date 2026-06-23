import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { getTopics } from '../../services/topicService.js';

export default function StudentDashboardPage() {
  const { t } = useTranslation();

  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      try {
        const response = await getTopics();
        setTopics(response.data.topics);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadTopics();
  }, []);

  const stats = useMemo(() => {
    const generatedCount = topics.filter((topic) => topic.status === 'GENERATED').length;
    const archivedCount = topics.filter((topic) => topic.status === 'ARCHIVED').length;
    const quizAttemptsCount = topics.reduce((total, topic) => total + topic.quizAttempts.length, 0);

    return {
      generatedCount,
      archivedCount,
      quizAttemptsCount
    };
  }, [topics]);

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('student.dashboardEyebrow')}
        title={t('student.dashboardTitle')}
        description={t('student.dashboardDescription')}
        actions={<Button to="/topics/create">{t('common.createTopic')}</Button>}
      />

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <section className="stats-grid">
        <StatCard label={t('student.topics')} value={topics.length} helper={t('student.topicsHelper')} />
        <StatCard
          label={t('student.generated')}
          value={stats.generatedCount}
          helper={t('student.generatedHelper')}
        />
        <StatCard
          label={t('student.quizAttempts')}
          value={stats.quizAttemptsCount}
          helper={t('student.quizAttemptsHelper')}
        />
        <StatCard
          label={t('student.archivedTopics')}
          value={stats.archivedCount}
          helper={t('student.archivedTopicsHelper')}
        />
      </section>

      <Card>
        <div className="card-title-row">
          <h2>{t('student.recentTopics')}</h2>
          <Button to="/topics/create" variant="secondary">
            {t('common.createTopic')}
          </Button>
        </div>

        {isLoading ? <p className="muted-text">{t('common.loading')}</p> : null}

        {!isLoading && topics.length === 0 ? (
          <p className="muted-text">{t('student.recentTopicsEmpty')}</p>
        ) : null}

        {!isLoading && topics.length > 0 ? (
          <div className="topic-list">
            {topics.map((topic) => (
              <article className="topic-list-item" key={topic.id}>
                <div>
                  <div className="topic-title-row">
                    <h3>{topic.title}</h3>
                    <Badge variant={topic.status === 'ARCHIVED' ? 'danger' : 'primary'}>
                      {topic.status}
                    </Badge>
                  </div>
                  <p>{topic.finalText || topic.originalText || t('student.noText')}</p>
                </div>

                <Button to={`/topics/${topic.id}`} variant="secondary">
                  {t('common.open')}
                </Button>
              </article>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  );
}