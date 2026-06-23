import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme.js';

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme}>
      {theme === 'light' ? t('common.dark') : t('common.light')}
    </button>
  );
}