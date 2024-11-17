const Feedback = require("../models/Feedback");

// Add feedback
exports.addFeedback = (req, res) => {
  const { userId, songId, feedbackText } = req.body;

  if (!userId || !songId || !feedbackText) {
    return res.status(400).json({ error: "All fields are required" });
  }

  Feedback.addFeedback(userId, songId, feedbackText, (err, result) => {
    if (err) {
      console.error("Error adding feedback:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ message: "Feedback submitted successfully" });
  });
};

// Get feedback for a song
exports.getFeedbackBySong = (req, res) => {
  const { songId } = req.params;

  if (!songId) {
    return res.status(400).json({ error: "Song ID is required" });
  }

  Feedback.getFeedbackBySong(songId, (err, results) => {
    if (err) {
      console.error("Error fetching feedback:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ feedback: results });
  });
};

// Approve feedback
exports.approveFeedback = (req, res) => {
  const { feedbackId } = req.body;

  console.log("Authenticated user:", req.user);

  const adminId = req.user.id;

  if (!feedbackId) {
    return res.status(400).json({ error: "Feedback ID is required" });
  }

  Feedback.approveFeedback(feedbackId, adminId, (err, result) => {
    if (err) {
      console.error("Error approving feedback:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback approved successfully" });
  });
};

// Reject feedback
exports.rejectFeedback = (req, res) => {
  const { feedbackId } = req.body;

  const adminId = req.user.id;

  if (!feedbackId) {
    return res.status(400).json({ error: "Feedback ID is required" });
  }

  Feedback.rejectFeedback(feedbackId, adminId, (err) => {
    if (err) {
      console.error("Error rejecting feedback:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ message: "Feedback rejected successfully" });
  });
};
