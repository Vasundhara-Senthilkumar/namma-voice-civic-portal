import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="marketing-page">
      <div className="card">
        <h1 className="page-title">About Us</h1>
        <p className="page-lead">
          Namma Voice is a civic complaint portal that helps residents report local issues in the
          language they are most comfortable with — and helps municipal teams act on them faster.
        </p>

        <div className="about-blocks">
          <section>
            <h2 className="section-title">Purpose</h2>
            <p>
              Everyday problems like water leaks, garbage piles, power outages, and road damage often
              get lost in phone queues or paper forms. Namma Voice gives citizens a single place to
              speak or type a complaint, then routes it to the right department with clear urgency
              and category signals.
            </p>
          </section>

          <section>
            <h2 className="section-title">Mission</h2>
            <p>
              Make civic reporting inclusive and actionable: lower the language barrier for
              residents, reduce triage work for staff, and keep complaint status transparent from
              submission through resolution.
            </p>
          </section>

          <section>
            <h2 className="section-title">How AI multilingual routing helps</h2>
            <p>
              When a complaint is submitted, keyword-based AI classification produces a short
              summary, assigns a category (Water, Garbage, Electricity, Road, or Other), estimates
              urgency, and maps the issue to a department such as Sanitation or the Electricity
              Board. Citizens get confirmation with those labels; staff see a department-filtered
              queue sorted by urgency so high-impact issues surface first.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link to="/citizen-auth" className="btn btn-primary">
            Get started as a citizen
          </Link>
        </div>
      </div>
    </div>
  );
}
