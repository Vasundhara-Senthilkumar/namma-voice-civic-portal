import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="marketing-page">
      <div className="card">
        <h1 className="page-title">Contact</h1>
        <p className="page-lead">
          Questions about Namma Voice, partnerships, or support? Reach out using the form or the
          helpline details below.
        </p>

        <div className="contact-layout">
          <form onSubmit={handleSubmit} className="contact-form">
            {sent && (
              <div className="alert-banner alert-info" style={{ backgroundColor: '#f0fdf4', borderColor: '#86efac', color: '#166534' }}>
                <CheckCircle2 size={18} />
                Message sent. Thank you — we will get back to you soon.
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                className="form-control"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Send size={18} /> Submit
            </button>
          </form>

          <aside className="contact-aside">
            <div className="meta-box">
              <h2 className="section-title" style={{ fontSize: '1.1rem' }}>
                Helpline
              </h2>
              <div className="meta-item">
                <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={14} /> Phone
                </div>
                <div className="meta-value">1800-000-VOICE</div>
              </div>
              <div className="meta-item">
                <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} /> Email
                </div>
                <div className="meta-value">hello@nammavoice.example</div>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Placeholder contact details for the demo — replace with your official helpline when
                you go live.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
