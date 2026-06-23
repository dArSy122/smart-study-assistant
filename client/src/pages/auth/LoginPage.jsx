import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function LoginPage() {
  const { t } = useTranslation();
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: 'student@smartstudy.local',
    password: 'Student123!'
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const loggedUser = await login(formData);

      if (loggedUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-grid">
      <Card>
        <PageHeader
          eyebrow={t('auth.loginEyebrow')}
          title={t('auth.loginTitle')}
          description={t('auth.loginDescription')}
        />

        {error ? <div className="alert alert-danger">{error}</div> : null}

        <form className="form-stack" onSubmit={handleSubmit}>
          <FormField
            label={t('common.email')}
            name="email"
            type="email"
            placeholder="student@smartstudy.local"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormField
            label={t('common.password')}
            name="password"
            type="password"
            placeholder="Student123!"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit">{isLoading ? t('common.loading') : t('common.login')}</Button>
        </form>

        <p className="form-helper">
          {t('auth.noAccount')} <Link to="/register">{t('common.register')}</Link>
        </p>
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