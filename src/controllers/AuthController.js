const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const blacklist = require("../middleware/blacklist");
const crypto = require("crypto");

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

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    User.getUserByEmail(email, (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      const user = results[0];

      // Generate a unique 6-digit reset code
      const resetCode = crypto.randomInt(100000, 999999); // 6-digit random number
      const expiryTime = Date.now() + 10 * 60 * 1000; // Code valid for 10 minutes

      // Store the code and expiration in the database
      const updateData = {
        reset_code: resetCode,
        reset_code_expiry: expiryTime,
      };

      User.updateUserById(user.user_id, updateData, (err) => {
        if (err) {
          console.error("Error storing reset code:", err);
          return res.status(500).send("Server error");
        }

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "6d8d9d2717b855", // Your Mailtrap username
            pass: "8037550ecb8835", // Your Mailtrap password
          },
        });

        // Email options
        const mailOptions = {
          from: '"Beathub Support" <support@beathub.com>', // Sender address
          to: email, // Recipient address
          subject: "Password Reset Code",
          html: `
            <p>Hello ${user.username},</p>
            <p>You requested to reset your password. Use the following code to reset your password:</p>
            <p><b>${resetCode}</b></p>
            <p>This code is valid for 10 minutes. If you didn't request a password reset, please ignore this email.</p>
          `,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ msg: "Failed to send email" });
          }

          console.log("Email sent:", info.response);
          res.json({ msg: "Password reset code sent to your email." });
        });
      });
    });
  } catch (err) {
    console.error("Error caught in try/catch block:", err);
    res.status(500).send("Server error");
  }
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Fetch user by email
    User.getUserByEmail(email, async (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      const user = results[0];

      // Check if the reset code is valid
      if (
        user.reset_code !== parseInt(code) ||
        user.reset_code_expiry < Date.now()
      ) {
        return res.status(400).json({ msg: "Invalid or expired reset code" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the password and clear the reset code
      const updateData = {
        password_hash: hashedPassword,
        reset_code: null,
        reset_code_expiry: null,
      };

      User.updateUserById(user.user_id, updateData, (err) => {
        if (err) {
          console.error("Error updating user password:", err);
          return res.status(500).send("Server error");
        }

        res.json({ msg: "Password reset successful." });
      });
    });
  } catch (err) {
    console.error("Error caught in try/catch block:", err);
    res.status(500).send("Server error");
  }
};

exports.logout = (req, res) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json({ msg: "No token provided" });
  }

  blacklist.add(token);

  res.status(200).json({ msg: "Logged out successfully" });
};
