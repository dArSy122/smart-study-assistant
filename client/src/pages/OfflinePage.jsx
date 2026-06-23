import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

export default function OfflinePage() {
  const { t } = useTranslation();

  return (
    <Card className="narrow-card">
      <PageHeader
        eyebrow={t('offline.eyebrow')}
        title={t('offline.title')}
        description={t('offline.description')}
      />
    </Card>
  );
}