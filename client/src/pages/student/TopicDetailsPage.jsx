import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

export default function TopicDetailsPage() {
  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Study topics"
        title="Topic Details"
        description="AI generated materials will be displayed here."
        actions={<Button to="/topics/1/quiz">Start quiz</Button>}
      />

      <section className="two-column-grid">
        <Card>
          <div className="card-title-row">
            <h2>Final text</h2>
            <Badge variant="default">DRAFT</Badge>
          </div>
          <p className="muted-text">
            The final edited study text will appear here after the topic module is connected.
          </p>
        </Card>

        <Card>
          <div className="card-title-row">
            <h2>AI summary</h2>
            <Badge variant="primary">AI</Badge>
          </div>
          <p className="muted-text">
            Summary, key terms, study plan and flashcards will appear here.
          </p>
        </Card>
      </section>
    </div>
  );
}