import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

export default function QuizPage() {
  return (
    <Card className="narrow-card">
      <PageHeader
        eyebrow="Quiz mode"
        title="Quiz"
        description="Students will solve generated questions and save their score."
      />

      <div className="quiz-placeholder">
        <p className="question-text">Question preview will appear here.</p>
        <div className="option-list">
          <button type="button">Answer option 1</button>
          <button type="button">Answer option 2</button>
          <button type="button">Answer option 3</button>
          <button type="button">Answer option 4</button>
        </div>
      </div>

      <Button type="button">Submit quiz</Button>
    </Card>
  );
}