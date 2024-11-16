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

exports.addSongToPlaylist = async (req, res) => {
  const { playlistId, songId } = req.body;

  try {
    Playlist.getPlaylistById(playlistId, (err, playlistResults) => {
      if (err) {
        console.error("Error querying playlist:", err);
        return res.status(500).send("Server error");
      }

      if (playlistResults.length === 0) {
        return res.status(404).json({ msg: "Playlist not found" });
      }

      Song.getSongById(songId, (err, songResults) => {
        if (err) {
          console.error("Error querying song:", err);
          return res.status(500).send("Server error");
        }

        if (songResults.length === 0) {
          return res.status(404).json({ msg: "Song not found" });
        }

        Playlist.isSongInPlaylist(playlistId, songId, (err, results) => {
          if (err) {
            console.error("Error checking song in playlist:", err);
            return res.status(500).send("Server error");
          }

          if (results.length > 0) {
            return res.status(400).json({ msg: "Song already in playlist" });
          }

          Playlist.addSongToPlaylist(playlistId, songId, (err) => {
            if (err) {
              console.error("Error adding song to playlist:", err);
              return res.status(500).send("Server error");
            }

            res.json({ msg: "Song added to playlist successfully" });
          });
        });
      });
    });
  } catch (err) {
    console.error("Error caught in try/catch block:", err);
    res.status(500).send("Server error");
  }
};

exports.deleteSongFromPlaylist = (req, res) => {
  const { playlistId, songId } = req.body;

  Playlist.isSongInPlaylist(playlistId, songId, (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Song not found in the playlist." });
    }

    Playlist.removeSongFromPlaylist(playlistId, songId, (err, result) => {
      if (err) {
        console.error("Error deleting song from playlist:", err);
        return res
          .status(500)
          .json({ error: "Failed to remove song from playlist" });
      }

      return res
        .status(200)
        .json({ message: "Song removed from playlist successfully." });
    });
  });
};
