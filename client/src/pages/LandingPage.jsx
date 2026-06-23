import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { checkApiHealth } from '../services/apiClient.js';

export default function LandingPage() {
  const { t } = useTranslation();
  const [apiStatus, setApiStatus] = useState(t('common.checkingBackend'));

  useEffect(() => {
    let isMounted = true;

    async function loadHealthStatus() {
      try {
        const result = await checkApiHealth();

        if (isMounted) {
          setApiStatus(result.data.status);
        }
      } catch (error) {
        if (isMounted) {
          setApiStatus(t('common.backendNotReachable'));
        }
      }
    }

    loadHealthStatus();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const modules = t('landing.modules', { returnObjects: true });

  return (
    <div className="landing-stack">
      <section className="hero-grid">
        <Card className="hero-content">
          <div className="badge-row">
            <Badge variant="primary">BG / EN</Badge>
            <Badge variant="success">MySQL</Badge>
            <Badge variant="default">React + Express</Badge>
          </div>

          <p className="eyebrow">{t('landing.eyebrow')}</p>
          <h1>{t('landing.title')}</h1>
          <p className="hero-text">{t('landing.description')}</p>

          <div className="hero-actions">
            <Button to="/register">{t('common.getStarted')}</Button>
            <Button to="/login" variant="secondary">
              {t('common.login')}
            </Button>
          </div>

          <div className="status-card">
            <span>{t('common.backendStatus')}</span>
            <strong>{apiStatus}</strong>
          </div>
        </Card>

        <Card className="hero-panel">
          <h2>{t('landing.includedModules')}</h2>
          <ul>
            {modules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="stats-grid">
        <StatCard
          label={t('landing.stats.rolesLabel')}
          value={t('landing.stats.rolesValue')}
          helper={t('landing.stats.rolesHelper')}
        />
        <StatCard
          label={t('landing.stats.databaseLabel')}
          value={t('landing.stats.databaseValue')}
          helper={t('landing.stats.databaseHelper')}
        />
        <StatCard
          label={t('landing.stats.aiLabel')}
          value={t('landing.stats.aiValue')}
          helper={t('landing.stats.aiHelper')}
        />
        <StatCard
          label={t('landing.stats.frontendLabel')}
          value={t('landing.stats.frontendValue')}
          helper={t('landing.stats.frontendHelper')}
        />
      </section>
    </div>
  );
}