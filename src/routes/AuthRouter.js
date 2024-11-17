const express = require("express");
const router = express.Router();
const Authenticate = require("../controllers/AuthController");
const auth = require("../middleware/auth");

router.post("/register", Authenticate.register);
router.post("/login", Authenticate.login);
router.post("/logout", auth, Authenticate.logout);

router.post("/request-password-reset", Authenticate.requestPasswordReset);
router.post("/reset-password", Authenticate.resetPassword);

module.exports = router;
