import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';

export default function SettingsPage() {
  return (
    <Card className="narrow-card">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Language, theme and notification settings will be managed from this page."
      />

      <div className="settings-row">
        <div>
          <strong>Theme</strong>
          <span>Switch between light and dark mode.</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="settings-row">
        <div>
          <strong>Language</strong>
          <span>Bulgarian and English support will be added in the i18n stage.</span>
        </div>
      </div>
    </Card>
  );
}