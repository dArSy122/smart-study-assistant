import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card.jsx';
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <Card className="narrow-card">
      <PageHeader
        eyebrow={t('settings.eyebrow')}
        title={t('settings.title')}
        description={t('settings.description')}
      />

      <div className="settings-row">
        <div>
          <strong>{t('common.theme')}</strong>
          <span>{t('settings.themeDescription')}</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="settings-row">
        <div>
          <strong>{t('common.language')}</strong>
          <span>{t('settings.languageDescription')}</span>
        </div>
        <LanguageSwitcher />
      </div>
    </Card>
  );
}