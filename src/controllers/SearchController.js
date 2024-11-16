const Search = require("../models/Search");

exports.search = (req, res) => {
  const input = req.query.input;
  if (!input) {
    return res.status(400).json({ error: "Input string is required" });
  }

  Search.search(input, (err, results) => {
    if (err) {
      console.error("Database error:", err); // Log database errors
      return res.status(500).json({ error: "Database error", details: err });
    }

    res.json(results);
  });
};
