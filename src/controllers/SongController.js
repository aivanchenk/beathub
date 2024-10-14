const Song = require("../models/Song");

exports.getAllSongs = (req, res) => {
  Song.getAllSongs((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};

exports.addSong = (req, res) => {
  const songData = req.body;

  Song.addSong(songData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error adding song" });
    }

    res.status(201).json({
      message: "Song added successfully",
      songId: result.insertId,
    });
  });
};

exports.deleteSong = (req, res) => {
  const { id } = req.params;

  Song.deleteSongById(id, (err, result) => {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete song as it is used in a playlist",
        });
      }
      return res.status(500).json({ error: "Error deleting song" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(201).json({
      message: "Song deleted successfully",
    });
  });
};

exports.updateSong = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  Song.updateSongById(id, data, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error updating song" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json({
      message: "Song updated successfully",
    });
  });
};

exports.getSongById = (req, res) => {
  const { id } = req.params;

  Song.getSongById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching song" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json(result[0]);
  });
};
