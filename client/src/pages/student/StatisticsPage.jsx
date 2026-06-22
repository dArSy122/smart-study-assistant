import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';

export default function StatisticsPage() {
  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Progress"
        title="Statistics"
        description="Charts will show study activity, quiz attempts and average score."
      />

      <section className="stats-grid">
        <StatCard label="Completed quizzes" value="0" helper="Total attempts" />
        <StatCard label="Average score" value="0%" helper="Across all topics" />
        <StatCard label="Generated topics" value="0" helper="With AI materials" />
        <StatCard label="Archived topics" value="0" helper="Hidden from active list" />
      </section>

      <Card>
        <h2>Charts area</h2>
        <div className="chart-placeholder">Chart.js or Recharts visualization will be added here.</div>
      </Card>
    </div>
  );
}