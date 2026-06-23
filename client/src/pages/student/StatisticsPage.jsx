import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { getMyStats } from '../../services/statsService.js';

export default function StatisticsPage() {
  const { t } = useTranslation();

  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await getMyStats();
        setStats(response.data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <p className="muted-text">{t('common.loading')}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <PageHeader
          eyebrow={t('stats.eyebrow')}
          title={t('stats.title')}
          description={t('stats.description')}
        />
        <div className="alert alert-danger">{error}</div>
      </Card>
    );
  }

  const overview = stats?.overview || {};
  const quizScores = stats?.chart?.quizScores || [];
  const recentAttempts = stats?.recentAttempts || [];
  const recentTopics = stats?.recentTopics || [];

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('stats.eyebrow')}
        title={t('stats.title')}
        description={t('stats.description')}
        actions={
          <div className="page-actions">
            <Button to="/library" variant="secondary">
              {t('library.title')}
            </Button>
            <Button to="/topics/create">
              {t('common.createTopic')}
            </Button>
          </div>
        }
      />

      <section className="stats-grid">
        <StatCard
          label={t('stats.totalTopics')}
          value={overview.totalTopics || 0}
          helper={t('stats.totalTopicsHelper')}
        />
        <StatCard
          label={t('stats.generatedTopics')}
          value={overview.generatedTopics || 0}
          helper={t('stats.generatedTopicsHelper')}
        />
        <StatCard
          label={t('stats.quizAttempts')}
          value={overview.totalQuizAttempts || 0}
          helper={t('stats.quizAttemptsHelper')}
        />
        <StatCard
          label={t('stats.averageScore')}
          value={`${overview.averageQuizScore || 0}%`}
          helper={t('stats.averageScoreHelper')}
        />
      </section>

      <section className="two-column-grid">
        <Card>
          <div className="card-title-row">
            <h2>{t('stats.topicStatus')}</h2>
            <Badge variant="primary">{t('stats.overview')}</Badge>
          </div>

          <div className="stats-mini-grid">
            <div>
              <span>{t('stats.activeTopics')}</span>
              <strong>{overview.activeTopics || 0}</strong>
            </div>
            <div>
              <span>{t('stats.draftTopics')}</span>
              <strong>{overview.draftTopics || 0}</strong>
            </div>
            <div>
              <span>{t('stats.archivedTopics')}</span>
              <strong>{overview.archivedTopics || 0}</strong>
            </div>
            <div>
              <span>{t('stats.folders')}</span>
              <strong>{overview.foldersCount || 0}</strong>
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-title-row">
            <h2>{t('stats.quizPerformance')}</h2>
            <Badge variant="primary">{overview.bestQuizScore || 0}%</Badge>
          </div>

          {quizScores.length === 0 ? (
            <p className="muted-text">{t('stats.noQuizData')}</p>
          ) : (
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={quizScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted)" />
                  <YAxis domain={[0, 100]} stroke="var(--color-muted)" />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      color: 'var(--color-text)'
                    }}
                  />
                  <Bar dataKey="score" fill="var(--color-primary)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </section>

      <section className="two-column-grid">
        <Card>
          <div className="card-title-row">
            <h2>{t('stats.recentAttempts')}</h2>
            <Button to="/library" variant="secondary">
              {t('common.open')}
            </Button>
          </div>

          {recentAttempts.length === 0 ? (
            <p className="muted-text">{t('stats.noAttempts')}</p>
          ) : (
            <div className="stats-list">
              {recentAttempts.map((attempt) => (
                <article className="stats-list-item" key={attempt.id}>
                  <div>
                    <strong>{attempt.topicTitle}</strong>
                    <span>{new Date(attempt.createdAt).toLocaleString()}</span>
                  </div>
                  <Badge variant={attempt.percentage >= 70 ? 'success' : 'danger'}>
                    {attempt.percentage}%
                  </Badge>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="card-title-row">
            <h2>{t('stats.recentTopics')}</h2>
            <Button to="/library" variant="secondary">
              {t('library.title')}
            </Button>
          </div>

          {recentTopics.length === 0 ? (
            <p className="muted-text">{t('stats.noTopics')}</p>
          ) : (
            <div className="stats-list">
              {recentTopics.map((topic) => (
                <article className="stats-list-item" key={topic.id}>
                  <div>
                    <strong>{topic.title}</strong>
                    <span>
                      {topic.folder?.name || t('library.noFolder')} · {new Date(topic.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <Badge variant={topic.status === 'ARCHIVED' ? 'danger' : 'primary'}>
                    {topic.status}
                  </Badge>
                </article>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}