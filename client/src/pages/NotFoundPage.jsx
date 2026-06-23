import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Card className="narrow-card">
      <PageHeader
        eyebrow={t('notFound.eyebrow')}
        title={t('notFound.title')}
        description={t('notFound.description')}
      />

      <Button to="/">{t('common.backToHome')}</Button>
    </Card>
  );
}