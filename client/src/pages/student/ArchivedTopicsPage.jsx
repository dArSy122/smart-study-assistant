import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TopicCard from '../../components/library/TopicCard.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { getTopics, restoreTopic } from '../../services/topicService.js';

export default function ArchivedTopicsPage() {
  const { t } = useTranslation();

  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  async function loadArchivedTopics() {
    setError('');

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

  const groupedTopics = useMemo(() => {
    const groupsMap = new Map();

    topics.forEach((topic) => {
      const folderKey = topic.folder?.id ? String(topic.folder.id) : 'no-folder';
      const folderName = topic.folder?.name || t('library.noFolder');

      if (!groupsMap.has(folderKey)) {
        groupsMap.set(folderKey, {
          id: folderKey,
          name: folderName,
          topics: []
        });
      }

      groupsMap.get(folderKey).topics.push(topic);
    });

    return Array.from(groupsMap.values()).sort((first, second) => {
      if (first.id === 'no-folder') {
        return 1;
      }

      if (second.id === 'no-folder') {
        return -1;
      }

      return first.name.localeCompare(second.name);
    });
  }, [topics, t]);

  async function handleRestore(topicId) {
    setError('');
    setMessage('');

    try {
      await restoreTopic(topicId);
      setMessage(t('library.topicRestored'));
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
        actions={
          <div className="page-actions">
            <Button to="/library" variant="secondary">
              {t('library.backToLibrary')}
            </Button>
          </div>
        }
      />

      {message ? <div className="alert alert-success">{message}</div> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      {isLoading ? (
        <Card>
          <p className="muted-text">{t('common.loading')}</p>
        </Card>
      ) : null}

      {!isLoading && topics.length === 0 ? (
        <Card>
          <p className="muted-text">{t('library.noArchivedTopics')}</p>
        </Card>
      ) : null}

      {!isLoading && groupedTopics.length > 0 ? (
        <div className="archive-folder-list">
          {groupedTopics.map((group) => (
            <Card key={group.id}>
              <div className="card-title-row">
                <div>
                  <h2>📁 {group.name}</h2>
                  <p className="muted-text">
                    {group.topics.length} {t('library.archivedTopicsCount')}
                  </p>
                </div>
              </div>

              <div className="library-topic-list">
                {group.topics.map((topic) => (
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
          ))}
        </div>
      ) : null}
    </div>
  );
}