import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { user, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    languagePreference: 'BG'
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
      const registeredUser = await register(formData);

      if (registeredUser.role === 'ADMIN') {
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
    <Card className="narrow-card">
      <PageHeader
        eyebrow={t('auth.registerEyebrow')}
        title={t('auth.registerTitle')}
        description={t('auth.registerDescription')}
      />

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <form className="form-stack" onSubmit={handleSubmit}>
        <FormField
          label={t('common.name')}
          name="name"
          placeholder={t('auth.yourName')}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <FormField
          label={t('common.email')}
          name="email"
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormField
          label={t('common.password')}
          name="password"
          type="password"
          placeholder={t('auth.passwordPlaceholder')}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label className="form-field" htmlFor="languagePreference">
          <span>{t('common.preferredLanguage')}</span>
          <select
            id="languagePreference"
            name="languagePreference"
            value={formData.languagePreference}
            onChange={handleChange}
          >
            <option value="BG">{t('common.bulgarian')}</option>
            <option value="EN">{t('common.english')}</option>
          </select>
        </label>

        <Button type="submit">{isLoading ? t('common.loading') : t('common.createAccount')}</Button>
      </form>

      <p className="form-helper">
        {t('auth.hasAccount')} <Link to="/login">{t('common.login')}</Link>
      </p>
    </Card>
  );
}