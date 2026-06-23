import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth.js';
import LanguageSwitcher from '../ui/LanguageSwitcher.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="app-header">
      <nav className="navbar">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-mark">{t('app.shortName')}</span>
          <span>{t('app.name')}</span>
        </NavLink>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">{t('nav.dashboard')}</NavLink>
              <NavLink to="/library">{t('nav.library')}</NavLink>
              <NavLink to="/topics/create">{t('nav.createTopic')}</NavLink>
              <NavLink to="/statistics">{t('nav.statistics')}</NavLink>

              {user?.role === 'ADMIN' ? <NavLink to="/admin">{t('nav.admin')}</NavLink> : null}

              <NavLink to="/settings">{t('nav.settings')}</NavLink>
            </>
          ) : null}

          <LanguageSwitcher />
          <ThemeToggle />

          {isAuthenticated ? (
            <button type="button" className="button button-secondary button-size-small" onClick={handleLogout}>
              {t('common.logout')}
            </button>
          ) : (
            <Link to="/login" className="button button-primary button-size-small">
              {t('nav.login')}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}