const db = require("../config/db");

class Feedback {
  // Add new feedback
  static addFeedback(userId, songId, feedbackText, callback) {
    const sql = `
      INSERT INTO feedback (user_id, song_id, feedback_text)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [userId, songId, feedbackText], callback);
  }

  // Get feedback for a specific song
  static getFeedbackBySong(songId, callback) {
    const sql = `
      SELECT f.feedback_id, f.feedback_text, f.status, u.username AS user, f.created_at
      FROM feedback f
      JOIN users u ON f.user_id = u.user_id
      WHERE f.song_id = ? AND f.status = 'approved'
    `;
    db.query(sql, [songId], callback);
  }

  // Approve feedback
  static approveFeedback(feedbackId, adminId, callback) {
    const sql = `
        UPDATE feedback
        SET status = 'approved', approved_by = ?, approved_at = NOW()
        WHERE feedback_id = ?
    `;
    db.query(sql, [adminId, feedbackId], callback);
  }

  // Reject feedback
  static rejectFeedback(feedbackId, adminId, callback) {
    const sql = `
      UPDATE feedback
      SET status = 'rejected', approved_by = ?, approved_at = NOW()
      WHERE feedback_id = ?
    `;
    db.query(sql, [adminId, feedbackId], callback);
  }
}

module.exports = Feedback;
