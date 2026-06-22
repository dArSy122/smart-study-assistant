import { useEffect, useState } from 'react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { checkApiHealth } from '../services/apiClient.js';

export default function LandingPage() {
  const [apiStatus, setApiStatus] = useState('Checking backend connection...');

  useEffect(() => {
    let isMounted = true;

    async function loadHealthStatus() {
      try {
        const result = await checkApiHealth();

        if (isMounted) {
          setApiStatus(result.data.status);
        }
      } catch (error) {
        if (isMounted) {
          setApiStatus('Backend is not reachable');
        }
      }
    }

    loadHealthStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="landing-stack">
      <section className="hero-grid">
        <Card className="hero-content">
          <div className="badge-row">
            <Badge variant="primary">BG / EN</Badge>
            <Badge variant="success">MySQL</Badge>
            <Badge variant="default">React + Express</Badge>
          </div>

          <p className="eyebrow">University practical project</p>
          <h1>Smart Study Assistant</h1>
          <p className="hero-text">
            Create study topics, extract text from images, generate AI materials,
            solve quizzes and track your learning progress.
          </p>

          <div className="hero-actions">
            <Button to="/register">Get started</Button>
            <Button to="/login" variant="secondary">
              Login
            </Button>
          </div>

          <div className="status-card">
            <span>Backend status</span>
            <strong>{apiStatus}</strong>
          </div>
        </Card>

        <Card className="hero-panel">
          <h2>Included modules</h2>
          <ul>
            <li>JWT authentication with STUDENT and ADMIN roles</li>
            <li>OCR from uploaded study images</li>
            <li>AI summaries, key terms, flashcards and quiz</li>
            <li>Statistics, activity logs and admin panel</li>
            <li>Bulgarian and English interface</li>
            <li>PWA and responsive design</li>
          </ul>
        </Card>
      </section>

      <section className="stats-grid">
        <StatCard label="Roles" value="2" helper="STUDENT and ADMIN" />
        <StatCard label="Main database" value="MySQL" helper="Managed by Prisma" />
        <StatCard label="AI mode" value="API + fallback" helper="Works without API key" />
        <StatCard label="Frontend" value="PWA ready" helper="Mobile friendly layout" />
      </section>
    </div>
  );
}