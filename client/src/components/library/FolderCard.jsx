import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';

export default function FolderCard({ folder, openLabel }) {
  return (
    <article className="folder-card">
      <div className="folder-icon">📁</div>
      <div className="folder-card-content">
        <div className="folder-title-row">
          <h3>{folder.name}</h3>
          <Badge variant="primary">{folder._count?.topics ?? folder.topics?.length ?? 0}</Badge>
        </div>
        <p>{folder.description || 'No description'}</p>
      </div>
      <Button to={`/library/folders/${folder.id}`} variant="secondary">
        {openLabel}
      </Button>
    </article>
  );
}