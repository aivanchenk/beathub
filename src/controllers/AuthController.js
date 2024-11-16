const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// User Registration
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user already exists
    User.getUserByEmail(email, async (err, results) => {
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

      // Create user data
      const newUser = {
        username,
        email,
        password_hash: hashedPassword,
        role: role || "listener", // Default role for new users is 'listener' if none provided
      };

      // Add new user to the database
      User.addUser(newUser, (err, result) => {
        if (err) {
          console.error("Error inserting user into database:", err);
          return res.status(500).send("Server error");
        }

        const payload = {
          user: {
            id: result.insertId,
            role: newUser.role,
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
      });
    });
  } catch (err) {
    console.error("Error caught in try/catch block:", err);
    res.status(500).send("Server error");
  }
};

// User Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  try {
    // Use the getUserByEmail method to find user by email
    User.getUserByEmail(email, async (err, results) => {
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

      const payload = {
        user: {
          id: user.user_id,
          role: user.role,
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
    });
  } catch (err) {
    console.error("Error caught in try/catch block:", err);
    res.status(500).send("Server error");
  }
};
