const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "beathub",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to the database.");
});

// API endpoint to fetch songs
app.get("/api/songs", (req, res) => {
  const sql = "SELECT * FROM songs"; // Query to fetch all songs
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching songs: " + error);
      return res.status(500).json({ error: "Error fetching songs" });
    }
    res.json(results); // Send the results as JSON
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
