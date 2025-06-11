import { Link } from "react-router-dom";
import "../styles/submission.css";

export default function SubmissionConfirmation() {
  return (
    <section className="confirmation-section container">
      <div className="confirmation-side">
        <div className="confirmation-logo" />
      </div>
      <div className="confirmation-side confirmation-message">
        <div className="submission-content">
          <h3 className="confirmation-title">Your submission has been sent…</h3>
          <p className="confirmation-subtitle">Chat soon!</p>
        </div>

          <Link to='/' className="back-btn">
            <p>Back</p>
            <img src="/assets/left.svg" alt="back-button" loading="lazy"></img>
          </Link>

      </div>
    </section>
  );
}

