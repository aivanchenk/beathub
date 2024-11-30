const Artist = require("../models/Artist");

exports.getTopArtists = (req, res) => {
  Artist.getTopArtists((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.status(200).json(results);
  });
};
