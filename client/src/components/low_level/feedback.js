import React from "react";
import PropTypes from "prop-types";

const FeedbackItem = ({ feedback }) => {
  return (
    <li className="feedback-item">
      <p className="feedback-text">"{feedback.feedback_text}"</p>
      <p className="feedback-meta">
        <span>User: {feedback.user}</span>
        <span> | Status: {feedback.status}</span>
        <span>
          {" "}
          | Submitted at: {new Date(feedback.created_at).toLocaleString()}
        </span>
      </p>
    </li>
  );
};

FeedbackItem.propTypes = {
  feedback: PropTypes.shape({
    feedback_id: PropTypes.number.isRequired,
    feedback_text: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeedbackItem;
