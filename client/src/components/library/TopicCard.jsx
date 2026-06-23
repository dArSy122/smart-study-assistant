import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';

export default function TopicCard({ topic, openLabel, restoreLabel, onRestore }) {
  return (
    <article className="library-topic-card">
      <div>
        <div className="topic-title-row">
          <h3>{topic.title}</h3>
          <Badge variant={topic.status === 'ARCHIVED' ? 'danger' : 'primary'}>
            {topic.status}
          </Badge>
        </div>

        <p className="topic-preview">
          {topic.finalText || topic.ocrText || topic.originalText || 'No text'}
        </p>

        <div className="topic-meta-row">
          <span>{topic.language}</span>
          {topic.folder ? <span>📁 {topic.folder.name}</span> : <span>📄 No folder</span>}
        </div>
      </div>

      <div className="library-topic-actions">
        {topic.status === 'ARCHIVED' && onRestore ? (
          <Button type="button" variant="secondary" onClick={() => onRestore(topic.id)}>
            {restoreLabel}
          </Button>
        ) : null}

        <Button to={`/topics/${topic.id}`} variant="secondary">
          {openLabel}
        </Button>
      </div>
    </article>
  );
}