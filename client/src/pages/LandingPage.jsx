import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button.jsx';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <main className="simple-landing">
      <section className="simple-landing-card">
        <p className="simple-landing-eyebrow">
          {t('landing.eyebrow')}
        </p>

        <h1>{t('landing.title')}</h1>

        <p className="simple-landing-description">
          {t('landing.description')}
        </p>

        <div className="simple-landing-actions">
          <Button to="/register">
            {t('landing.getStarted')}
          </Button>

          <Button to="/login" variant="secondary">
            {t('landing.login')}
          </Button>
        </div>
      </section>
    </main>
  );
}