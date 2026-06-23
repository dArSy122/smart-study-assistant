import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="page-grid">
      <Card>
        <PageHeader
          eyebrow={t('auth.loginEyebrow')}
          title={t('auth.loginTitle')}
          description={t('auth.loginDescription')}
        />

        <form className="form-stack">
          <FormField
            label={t('common.email')}
            name="email"
            type="email"
            placeholder="student@smartstudy.local"
          />
          <FormField
            label={t('common.password')}
            name="password"
            type="password"
            placeholder="Student123!"
          />

          <Button type="button">{t('common.login')}</Button>
        </form>
      </Card>

      <Card className="side-card">
        <h2>{t('auth.testAccounts')}</h2>
        <div className="info-list">
          <p>
            <strong>{t('auth.student')}</strong>
            <span>student@smartstudy.local / Student123!</span>
          </p>
          <p>
            <strong>{t('auth.admin')}</strong>
            <span>admin@smartstudy.local / Admin123!</span>
          </p>
        </div>
      </Card>
    </div>
  );
}