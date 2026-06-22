import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <section className="hero-grid">
      <div className="hero-content">
        <p className="eyebrow">University practical project</p>
        <h1>Smart Study Assistant</h1>
        <p className="hero-text">
          Create study topics, extract text from images, generate AI materials,
          solve quizzes and track your learning progress.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="button">
            Get started
          </Link>
          <Link to="/login" className="button button-secondary">
            Login
          </Link>
        </div>

        <div className="status-card">
          <span>Backend status:</span>
          <strong>{apiStatus}</strong>
        </div>
      </div>

      <div className="hero-panel">
        <h2>Included modules</h2>
        <ul>
          <li>JWT authentication with STUDENT and ADMIN roles</li>
          <li>OCR from uploaded study images</li>
          <li>AI summaries, key terms, flashcards and quiz</li>
          <li>Statistics, activity logs and admin panel</li>
          <li>Bulgarian and English interface</li>
          <li>PWA and responsive design</li>
        </ul>
      </div>
    </section>
  );
}