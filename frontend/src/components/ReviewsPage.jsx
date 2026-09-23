import React from 'react';
import { REVIEWS } from '../data/siteContent';

export default function ReviewsPage() {
  return (
    <div className="marketing-page">
      <div className="card">
        <h1 className="page-title">Reviews</h1>
        <p className="page-lead">
          Hear from citizens and municipal staff who use Namma Voice for multilingual complaint
          reporting and department routing.
        </p>

        <div className="reviews-grid reviews-grid-full">
          {REVIEWS.map((review) => (
            <article key={review.name} className="review-card">
              <p className="review-quote">"{review.quote}"</p>
              <div className="review-author">{review.name}</div>
              <div className="review-role">{review.role}</div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
