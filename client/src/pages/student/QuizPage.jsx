import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { getQuizForTopic, submitQuizForTopic } from '../../services/quizService.js';

export default function QuizPage() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [topic, setTopic] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [review, setReview] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [latestAttempt, setLatestAttempt] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const response = await getQuizForTopic(id);

        setTopic(response.data.topic);
        setQuiz(response.data.quiz);
        setLatestAttempt(response.data.latestAttempt);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuiz();
  }, [id]);

  const answeredCount = useMemo(
    () => Object.keys(selectedAnswers).length,
    [selectedAnswers]
  );

  const allQuestionsAnswered = quiz.length > 0 && answeredCount === quiz.length;

  function handleSelectAnswer(questionIndex, selectedAnswerIndex) {
    if (attempt) {
      return;
    }

    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionIndex]: selectedAnswerIndex
    }));
  }

  async function handleSubmit() {
    setError('');
    setIsSubmitting(true);

    const answers = Object.entries(selectedAnswers).map(([questionIndex, selectedAnswerIndex]) => ({
      questionIndex: Number(questionIndex),
      selectedAnswerIndex: Number(selectedAnswerIndex)
    }));

    try {
      const response = await submitQuizForTopic(id, answers);

      setAttempt(response.data.attempt);
      setReview(response.data.review);
      if (response.data.nextQuizGenerated) {
        setError('');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function getAnswerClass(questionIndex, optionIndex) {
    if (!attempt) {
      return selectedAnswers[questionIndex] === optionIndex ? 'quiz-option selected' : 'quiz-option';
    }

    const reviewItem = review.find((item) => item.questionIndex === questionIndex);

    if (!reviewItem) {
      return 'quiz-option';
    }

    if (reviewItem.correctAnswerIndex === optionIndex) {
      return 'quiz-option correct';
    }

    if (reviewItem.selectedAnswerIndex === optionIndex && !reviewItem.isCorrect) {
      return 'quiz-option wrong';
    }

    return 'quiz-option';
  }

  if (isLoading) {
    return (
      <Card>
        <p className="muted-text">{t('common.loading')}</p>
      </Card>
    );
  }

  if (error && !topic) {
    return (
      <Card>
        <PageHeader
          eyebrow={t('quiz.eyebrow')}
          title={t('quiz.notAvailableTitle')}
          description={t('quiz.notAvailableDescription')}
        />
        <div className="alert alert-danger">{error}</div>
        <Button to={`/topics/${id}`} variant="secondary">
          {t('quiz.backToTopic')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow={t('quiz.eyebrow')}
        title={topic?.title || t('quiz.title')}
        description={t('quiz.description')}
        actions={
          <div className="page-actions">
            <Button to={`/topics/${id}/quiz/history`} variant="secondary">
              {t('quiz.quizArchive')}
            </Button>
            <Button to={`/topics/${id}`} variant="secondary">
              {t('quiz.backToTopic')}
            </Button>
          </div>
        }
      />

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {latestAttempt && !attempt ? (
        <Card>
          <div className="card-title-row">
            <h2>{t('quiz.latestAttempt')}</h2>
            <Badge variant="primary">
              {latestAttempt.score}/{latestAttempt.totalQuestions}
            </Badge>
          </div>
          <p className="muted-text">
            {t('quiz.latestAttemptHelper')}
          </p>
        </Card>
      ) : null}

      {attempt ? (
        <Card>
          <div className="quiz-result">
            <span>{t('quiz.result')}</span>
            <strong>
              {attempt.score}/{attempt.totalQuestions}
            </strong>
          </div>
        </Card>
      ) : null}

      <div className="quiz-list">
        {quiz.map((question) => (
          <Card key={question.questionIndex}>
            <div className="quiz-question-header">
              <Badge variant="primary">
                {t('quiz.question')} {question.questionIndex + 1}
              </Badge>
              <h2>{question.question}</h2>
            </div>

            <div className="quiz-options">
              {question.options.map((option, optionIndex) => (
                <button
                  key={`${question.questionIndex}-${optionIndex}`}
                  type="button"
                  className={getAnswerClass(question.questionIndex, optionIndex)}
                  onClick={() => handleSelectAnswer(question.questionIndex, optionIndex)}
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span>
                  <strong>{option}</strong>
                </button>
              ))}
            </div>

            {attempt ? (
              <div className="quiz-explanation">
                {review.find((item) => item.questionIndex === question.questionIndex)?.isCorrect ? (
                  <strong className="correct-text">{t('quiz.correct')}</strong>
                ) : (
                  <strong className="wrong-text">{t('quiz.wrong')}</strong>
                )}
                <p>
                  {review.find((item) => item.questionIndex === question.questionIndex)?.explanation}
                </p>
              </div>
            ) : null}
          </Card>
        ))}
      </div>

      {!attempt ? (
        <Card>
          <div className="quiz-submit-row">
            <div>
              <strong>{t('quiz.answered')}</strong>
              <p className="muted-text">
                {answeredCount}/{quiz.length}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('quiz.submit')}
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}