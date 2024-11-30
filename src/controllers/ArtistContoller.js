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

exports.getSongsByArtist = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  Artist.getSongsByArtist(id, (err, results) => {
    if (err) {
      console.error("Error fetching songs by artist:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No songs found for the artist." });
    }

    res.status(200).json({ songs: results });
  });
};
