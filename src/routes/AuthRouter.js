const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { register, login } = require("../controllers/AuthController");
const db = require("../config/db");

router.post("/register", register);
router.post("/login", login);

// Protected route example
router.get("/me", auth, (req, res) => {
  try {
    console.log("Accessing /me route");

    // Log the decoded user ID from the JWT token
    console.log("Decoded user ID from JWT:", req.user.id);

    // Fetch the user from the database using the user_id from the decoded JWT token
    db.query(
      "SELECT user_id, username, email, role FROM users WHERE user_id = ?",
      [req.user.id],
      (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).send("Server error");
        }

        console.log("Database query successful. Results:", results);

        if (results.length === 0) {
          console.log("User not found with user_id:", req.user.id);
          return res.status(404).json({ msg: "User not found" });
        }

        // Get the user details from the result
        const user = results[0];
        console.log("User found:", user);

        // Respond with the user's details, excluding the password
        res.json({
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        });
      }
    );
  } catch (err) {
    console.error("Error caught in try/catch block:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
