import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <Card className="narrow-card">
      <PageHeader
        eyebrow={t('auth.registerEyebrow')}
        title={t('auth.registerTitle')}
        description={t('auth.registerDescription')}
      />

      <form className="form-stack">
        <FormField label={t('common.name')} name="name" placeholder={t('auth.yourName')} />
        <FormField
          label={t('common.email')}
          name="email"
          type="email"
          placeholder={t('auth.emailPlaceholder')}
        />
        <FormField
          label={t('common.password')}
          name="password"
          type="password"
          placeholder={t('auth.passwordPlaceholder')}
        />

        <label className="form-field" htmlFor="languagePreference">
          <span>{t('common.preferredLanguage')}</span>
          <select id="languagePreference" name="languagePreference" defaultValue="BG">
            <option value="BG">{t('common.bulgarian')}</option>
            <option value="EN">{t('common.english')}</option>
          </select>
        </label>

        <Button type="button">{t('common.createAccount')}</Button>
      </form>
    </Card>
  );
}