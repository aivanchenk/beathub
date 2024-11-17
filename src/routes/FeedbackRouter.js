const express = require("express");
const router = express.Router();
const FeedbackController = require("../controllers/FeedbackController");
const auth = require("../middleware/auth"); // Authentication middleware

// Authorization function to check user roles
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ msg: "Access forbidden: insufficient permissions" });
  }
  next();
};

router.post("/add", auth, FeedbackController.addFeedback);
router.get("/:songId", FeedbackController.getFeedbackBySong);

router.post(
  "/approve",
  auth,
  authorize(["admin"]),
  FeedbackController.approveFeedback
);

router.post(
  "/reject",
  auth,
  authorize(["admin"]),
  FeedbackController.rejectFeedback
);

module.exports = router;
