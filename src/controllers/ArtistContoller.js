const Artist = require("../models/Artist");

exports.getTopArtists = (req, res) => {
  Artist.getTopArtists((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.status(200).json(results);
  });
};

exports.getArtistById = (req, res) => {
  const { id } = req.params;

  Artist.getArtistById(id, (err, artist) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching artist by ID" });
    }

    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    res.status(200).json(artist);
  });
};
