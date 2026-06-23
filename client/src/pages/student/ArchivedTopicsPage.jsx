import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TopicCard from '../../components/library/TopicCard.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { getTopics, restoreTopic } from '../../services/topicService.js';

export default function ArchivedTopicsPage() {
  const { t } = useTranslation();

  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  async function loadArchivedTopics() {
    try {
      const response = await getTopics({ status: 'archived' });
      setTopics(response.data.topics);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadArchivedTopics();
  }, []);

  async function handleRestore(topicId) {
    try {
      await restoreTopic(topicId);
      await loadArchivedTopics();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('library.archiveEyebrow')}
        title={t('library.archiveTitle')}
        description={t('library.archiveDescription')}
      />

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {isLoading ? <Card><p className="muted-text">{t('common.loading')}</p></Card> : null}

      {!isLoading ? (
        <Card>
          {topics.length === 0 ? <p className="muted-text">{t('library.noArchivedTopics')}</p> : null}

          <div className="library-topic-list">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                openLabel={t('common.open')}
                restoreLabel={t('library.restore')}
                onRestore={handleRestore}
              />
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}