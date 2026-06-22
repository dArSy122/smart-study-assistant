import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';

export default function AdminDashboardPage() {
  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Admin panel"
        title="Admin Dashboard"
        description="Admin users will manage users, topics, roles and activity logs."
      />

      <section className="stats-grid">
        <StatCard label="Users" value="0" helper="Registered accounts" />
        <StatCard label="Topics" value="0" helper="All study topics" />
        <StatCard label="Activity logs" value="0" helper="Tracked system actions" />
        <StatCard label="Admins" value="1" helper="Seed admin account" />
      </section>

      <Card>
        <div className="card-title-row">
          <h2>Admin permissions</h2>
          <Badge variant="danger">ADMIN</Badge>
        </div>
        <p className="muted-text">
          This section will show users, topics and activity logs after admin endpoints are connected.
        </p>
      </Card>
    </div>
  );
}