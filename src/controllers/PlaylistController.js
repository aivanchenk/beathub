const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

exports.getAllPlaylists = (req, res) => {
  Playlist.getAllPlaylists((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

exports.getSongsByPlaylistId = (req, res) => {
  const playlistId = req.params.id;

  Song.getSongsByPlaylistId(playlistId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No songs found for this playlist." });
    }

    res.json(results);
  });
};

exports.getPlaylistById = (req, res) => {
  const { id } = req.params;

  Playlist.getPlaylistById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching playlist" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json(result[0]);
  });
};

exports.addPlaylist = (req, res) => {
  const playlistData = req.body;

  Playlist.addPlaylist(playlistData, (err, result) => {
    if (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ error: "Error adding playlist" });
    }

    res.status(201).json({
      message: "Playlist added successfully",
      playlistId: result.insertId, // Use playlistId for clarity
    });
  });
};

exports.updatePlaylistById = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  Playlist.updatePlaylistById(id, data, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error updating playlist" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({
      message: "Playlist updated successfully",
    });
  });
};

exports.deletePlaylist = (req, res) => {
  const { id } = req.params;

  Playlist.deletePlaylistById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting playlist" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({
      message: "Playlist deleted successfully",
    });
  });
};

exports.deleteSongFromPlaylist = (req, res) => {
  const { id, songId } = req.params;

  Playlist.removeSongFromPlaylist(id, songId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Song deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ message: "Song not found in the playlist." });
    }
  });
};