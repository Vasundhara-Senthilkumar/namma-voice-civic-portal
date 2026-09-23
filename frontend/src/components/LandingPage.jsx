import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mic, Languages, Route, CheckCircle2 } from 'lucide-react';
import { REVIEWS } from '../data/siteContent';

const STATS = [
  { value: '5', label: 'Departments covered' },
  { value: '3+', label: 'Languages supported' },
  { value: 'AI', label: 'Category & urgency routing' },
  { value: '24h', label: 'Token session window' },
];

const STEPS = [
  {
    icon: Mic,
    title: 'Speak or type',
    text: 'Submit a complaint in English, Hindi, or Tamil using text or voice input.',
  },
  {
    icon: Languages,
    title: 'AI classifies',
    text: 'Namma Voice summarizes the issue and assigns category, urgency, and department.',
  },
  {
    icon: Route,
    title: 'Routed to staff',
    text: 'The right municipal team sees it on their department dashboard, urgency-first.',
  },
  {
    icon: CheckCircle2,
    title: 'Track resolution',
    text: 'Staff update status from Pending to In Progress to Resolved as work completes.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const previewReviews = REVIEWS.slice(0, 3);

  return (
    <div className="marketing-page">
      <section className="card hero-section">
        <h1 className="hero-title">Welcome to Namma Voice</h1>
        <p className="hero-desc">
          Empowering citizens to voice civic issues instantly. Submit complaints using text or voice
          in your preferred language, track automated AI classification, and enable speedy resolution.
        </p>

        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/citizen-auth')}>
            <User size={20} />
            Continue as Citizen
          </button>

          <button className="btn btn-secondary" onClick={() => navigate('/staff-auth')}>
            <ShieldCheck size={20} />
            Continue as Staff
          </button>
        </div>
      </section>

      <section className="stats-grid" aria-label="Platform highlights">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="section-title">How it works</h2>
        <p className="section-lead">
          From voice to department queue in a few steps — built for multilingual civic reporting.
        </p>
        <div className="steps-grid">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="step-card">
              <div className="step-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">What citizens & staff say</h2>
            <p className="section-lead" style={{ marginBottom: 0 }}>
              Real feedback from early users of AI-assisted complaint routing.
            </p>
          </div>
          <Link to="/reviews" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
            View all reviews
          </Link>
        </div>
        <div className="reviews-grid">
          {previewReviews.map((review) => (
            <article key={review.name} className="review-card">
              <p className="review-quote">"{review.quote}"</p>
              <div className="review-author">{review.name}</div>
              <div className="review-role">{review.role}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
