import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateFolderModal from '../../components/library/CreateFolderModal.jsx';
import FolderCard from '../../components/library/FolderCard.jsx';
import TopicCard from '../../components/library/TopicCard.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { createFolder, getFolders } from '../../services/folderService.js';
import { getTopics } from '../../services/topicService.js';

export default function LibraryPage() {
  const { t } = useTranslation();

  const [folders, setFolders] = useState([]);
  const [unassignedTopics, setUnassignedTopics] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  async function loadLibrary() {
    setError('');

    try {
      const [foldersResponse, topicsResponse] = await Promise.all([
        getFolders(),
        getTopics({ status: 'active', folderId: 'unassigned' })
      ]);

      setFolders(foldersResponse.data.folders);
      setUnassignedTopics(topicsResponse.data.topics);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLibrary();
  }, []);

  async function handleCreateFolder(payload) {
    try {
      await createFolder(payload);
      setIsCreateFolderOpen(false);
      await loadLibrary();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('library.eyebrow')}
        title={t('library.title')}
        description={t('library.description')}
        actions={
          <div className="page-actions">
            <Button type="button" onClick={() => setIsCreateFolderOpen(true)}>
              {t('library.createFolder')}
            </Button>
            <Button to="/library/archive" variant="secondary">
              {t('library.archive')}
            </Button>
          </div>
        }
      />

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {isLoading ? <Card><p className="muted-text">{t('common.loading')}</p></Card> : null}

      {!isLoading ? (
        <>
          <Card>
            <div className="card-title-row">
              <h2>{t('library.folders')}</h2>
              <Button to="/topics/create" variant="secondary">{t('common.createTopic')}</Button>
            </div>

            {folders.length === 0 ? <p className="muted-text">{t('library.noFolders')}</p> : null}

            <div className="folder-grid">
              {folders.map((folder) => (
                <FolderCard key={folder.id} folder={folder} openLabel={t('common.open')} />
              ))}
            </div>
          </Card>

          <Card>
            <h2>{t('library.unassignedTopics')}</h2>

            {unassignedTopics.length === 0 ? <p className="muted-text">{t('library.noUnassignedTopics')}</p> : null}

            <div className="library-topic-list">
              {unassignedTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} openLabel={t('common.open')} />
              ))}
            </div>
          </Card>
        </>
      ) : null}

      {isCreateFolderOpen ? (
        <CreateFolderModal
          title={t('library.createFolder')}
          nameLabel={t('library.folderName')}
          descriptionLabel={t('library.folderDescription')}
          cancelLabel={t('common.cancel')}
          saveLabel={t('common.save')}
          onClose={() => setIsCreateFolderOpen(false)}
          onSubmit={handleCreateFolder}
        />
      ) : null}
    </div>
  );
}