import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

export default function QuizPage() {
  const { t } = useTranslation();

  return (
    <Card className="narrow-card">
      <PageHeader
        eyebrow={t('student.quizEyebrow')}
        title={t('student.quizTitle')}
        description={t('student.quizDescription')}
      />

      <div className="quiz-placeholder">
        <p className="question-text">{t('student.questionPreview')}</p>
        <div className="option-list">
          <button type="button">{t('student.answer1')}</button>
          <button type="button">{t('student.answer2')}</button>
          <button type="button">{t('student.answer3')}</button>
          <button type="button">{t('student.answer4')}</button>
        </div>
      </div>

      <Button type="button">{t('common.submitQuiz')}</Button>
    </Card>
  );
}