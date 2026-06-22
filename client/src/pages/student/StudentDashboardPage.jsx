import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';

export default function StudentDashboardPage() {
  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Student area"
        title="Student Dashboard"
        description="Overview of topics, quiz activity and learning progress."
        actions={<Button to="/topics/create">Create topic</Button>}
      />

      <section className="stats-grid">
        <StatCard label="Topics" value="0" helper="Created study topics" />
        <StatCard label="Generated" value="0" helper="AI generated materials" />
        <StatCard label="Quiz attempts" value="0" helper="Saved test attempts" />
        <StatCard label="Average score" value="0%" helper="Based on quiz results" />
      </section>

      <Card>
        <h2>Recent topics</h2>
        <p className="muted-text">
          Student topics will appear here after the topics module is connected.
        </p>
      </Card>
    </div>
  );
}