import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import TopicCard from '../../components/library/TopicCard.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { getFolderById } from '../../services/folderService.js';

export default function FolderDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [folder, setFolder] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFolder() {
      try {
        const response = await getFolderById(id);
        setFolder(response.data.folder);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadFolder();
  }, [id]);

  if (isLoading) {
    return <Card><p className="muted-text">{t('common.loading')}</p></Card>;
  }

  if (!folder) {
    return <Card><p className="muted-text">{error}</p></Card>;
  }

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('library.folder')}
        title={folder.name}
        description={folder.description || t('library.noFolderDescription')}
        actions={
          <div className="page-actions">
            <Button to="/library" variant="secondary">{t('library.backToLibrary')}</Button>
            <Button to={`/topics/create?folderId=${folder.id}`}>{t('common.createTopic')}</Button>
          </div>
        }
      />

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <Card>
        <h2>{t('library.folderTopics')}</h2>

        {folder.topics.length === 0 ? <p className="muted-text">{t('library.noFolderTopics')}</p> : null}

        <div className="library-topic-list">
          {folder.topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} openLabel={t('common.open')} />
          ))}
        </div>
      </Card>
    </div>
  );
}