import { useTranslation } from 'react-i18next';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="content-stack">
      <PageHeader eyebrow={t('admin.eyebrow')} title={t('admin.title')} description={t('admin.description')} />

      <section className="stats-grid">
        <StatCard label={t('admin.users')} value="0" helper={t('admin.usersHelper')} />
        <StatCard label={t('admin.topics')} value="0" helper={t('admin.topicsHelper')} />
        <StatCard
          label={t('admin.activityLogs')}
          value="0"
          helper={t('admin.activityLogsHelper')}
        />
        <StatCard label={t('admin.admins')} value={user?.role === 'ADMIN' ? '1' : '0'} helper={t('admin.adminsHelper')} />
      </section>

      <Card>
        <div className="card-title-row">
          <h2>{t('admin.permissions')}</h2>
          <Badge variant="danger">ADMIN</Badge>
        </div>
        <p className="muted-text">{t('admin.permissionsDescription')}</p>
      </Card>
    </div>
  );
}