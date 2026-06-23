import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { getQuizAttemptsForTopic } from '../../services/quizService.js';

export default function QuizAttemptsPage() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [topic, setTopic] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [expandedAttemptId, setExpandedAttemptId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAttempts() {
      try {
        const response = await getQuizAttemptsForTopic(id);

        setTopic(response.data.topic);
        setAttempts(response.data.attempts);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadAttempts();
  }, [id]);

  function toggleAttempt(attemptId) {
    setExpandedAttemptId((currentId) => (currentId === attemptId ? null : attemptId));
  }

  if (isLoading) {
    return (
      <Card>
        <p className="muted-text">{t('common.loading')}</p>
      </Card>
    );
  }

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('quiz.archiveEyebrow')}
        title={topic?.title || t('quiz.archiveTitle')}
        description={t('quiz.archiveDescription')}
        actions={
          <div className="page-actions">
            <Button to={`/topics/${id}/quiz`} variant="secondary">
              {t('quiz.newQuiz')}
            </Button>
            <Button to={`/topics/${id}`} variant="secondary">
              {t('quiz.backToTopic')}
            </Button>
          </div>
        }
      />

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {attempts.length === 0 ? (
        <Card>
          <p className="muted-text">{t('quiz.noAttempts')}</p>
        </Card>
      ) : null}

      <div className="quiz-attempt-list">
        {attempts.map((attempt, index) => {
          const isExpanded = expandedAttemptId === attempt.id;
          const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
          const answers = Array.isArray(attempt.answersJson) ? attempt.answersJson : [];

          return (
            <Card key={attempt.id}>
              <div className="quiz-attempt-header">
                <div>
                  <Badge variant="primary">
                    {t('quiz.attempt')} #{attempts.length - index}
                  </Badge>
                  <h2>
                    {attempt.score}/{attempt.totalQuestions} — {percentage}%
                  </h2>
                  <p className="muted-text">
                    {new Date(attempt.createdAt).toLocaleString()}
                  </p>
                </div>

                <Button type="button" variant="secondary" onClick={() => toggleAttempt(attempt.id)}>
                  {isExpanded ? t('quiz.hideReview') : t('quiz.viewReview')}
                </Button>
              </div>

              {isExpanded ? (
                <div className="quiz-review-list">
                  {answers.map((answer) => (
                    <div className="quiz-review-item" key={answer.questionIndex}>
                      <div className="quiz-review-title">
                        <strong>{answer.question}</strong>
                        {answer.isCorrect ? (
                          <Badge variant="success">{t('quiz.correct')}</Badge>
                        ) : (
                          <Badge variant="danger">{t('quiz.wrong')}</Badge>
                        )}
                      </div>

                      <div className="quiz-review-options">
                        {answer.options.map((option, optionIndex) => {
                          const isCorrect = optionIndex === answer.correctAnswerIndex;
                          const isSelected = optionIndex === answer.selectedAnswerIndex;

                          return (
                            <div
                              className={[
                                'quiz-review-option',
                                isCorrect ? 'correct' : '',
                                isSelected && !isCorrect ? 'wrong' : ''
                              ].join(' ').trim()}
                              key={`${answer.questionIndex}-${optionIndex}`}
                            >
                              <span>{String.fromCharCode(65 + optionIndex)}</span>
                              <strong>{option}</strong>
                            </div>
                          );
                        })}
                      </div>

                      {answer.explanation ? (
                        <p className="muted-text">{answer.explanation}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}