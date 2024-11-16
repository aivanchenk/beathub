const express = require("express");
const router = express.Router();
const FeedbackController = require("../controllers/FeedbackController");

router.post("/add", FeedbackController.addFeedback);
router.get("/:songId", FeedbackController.getFeedbackBySong);
router.post("/approve", FeedbackController.approveFeedback);
router.post("/reject", FeedbackController.rejectFeedback);

module.exports = router;
