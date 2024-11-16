const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// User Registration
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Error querying the database:", err);
          return res.status(500).send("Server error");
        }

        if (results.length > 0) {
          return res.status(400).json({ msg: "User already exists" });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into the database
        db.query(
          "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (err, result) => {
            if (err) {
              console.error("Error inserting user into database:", err);
              return res.status(500).send("Server error");
            }

            // Create token with the correct ID field from the database insert
            const payload = {
              user: {
                id: result.insertId, // Use result.insertId to get the newly generated user ID
              },
            };

            jwt.sign(
              payload,
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRES_IN },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        );
      }
    );
  } catch (err) {
    console.error("Error caught in try/catch block:", err);
    res.status(500).send("Server error");
  }
};

// User Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the database
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Error querying the database:", err);
          return res.status(500).send("Server error");
        }

        if (results.length === 0) {
          return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const user = results[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          return res.status(400).json({ msg: "Invalid Credentials" });
        }

        // Create token with the correct user_id field
        const payload = {
          user: {
            id: user.user_id, // Use user.user_id to get the user's ID from the database
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      }
    );
  } catch (err) {
    console.error("Error caught in try/catch block:", err);
    res.status(500).send("Server error");
  }
};
