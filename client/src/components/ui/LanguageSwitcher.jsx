import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  function changeLanguage(language) {
    i18n.changeLanguage(language);
  }

  return (
    <div className="language-switcher" aria-label={t('common.language')}>
      <button
        type="button"
        className={i18n.language === 'bg' ? 'active' : ''}
        onClick={() => changeLanguage('bg')}
      >
        {t('common.bg')}
      </button>

      <button
        type="button"
        className={i18n.language === 'en' ? 'active' : ''}
        onClick={() => changeLanguage('en')}
      >
        {t('common.en')}
      </button>
    </div>
  );
}