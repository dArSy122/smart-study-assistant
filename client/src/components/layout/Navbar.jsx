import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <nav className="navbar">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-mark">{t('app.shortName')}</span>
          <span>{t('app.name')}</span>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/dashboard">{t('nav.dashboard')}</NavLink>
          <NavLink to="/topics/create">{t('nav.createTopic')}</NavLink>
          <NavLink to="/statistics">{t('nav.statistics')}</NavLink>
          <NavLink to="/admin">{t('nav.admin')}</NavLink>
          <NavLink to="/settings">{t('nav.settings')}</NavLink>
          <LanguageSwitcher />
          <ThemeToggle />
          <NavLink to="/login" className="button button-primary button-small">
            {t('nav.login')}
          </NavLink>
        </div>
      </nav>
    </header>
  );
}