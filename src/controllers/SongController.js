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

  // Attach the user ID to the song data
  songData.added_by = req.user.id;

  Song.addSong(songData, (err, result) => {
    if (err) {
      console.error("Error adding song:", err);
      return res.status(500).json({ error: "Error adding song" });
    }

    res.status(201).json({
      message: "Song added successfully",
      songId: result.insertId,
    });
  });
};

exports.deleteSong = (req, res) => {
  const { id: userId, role } = req.user; // Extract user ID and role from the token
  const { id: songId } = req.params;

  if (!songId) {
    return res.status(400).json({ error: "Song ID is required" });
  }

  const deleteSongAndReferences = () => {
    // Step 1: Delete references from playlist_songs
    Song.deleteSongReferencesFromPlaylists(songId, (err) => {
      if (err) {
        console.error("Error deleting song references from playlists:", err);
        return res
          .status(500)
          .json({ error: "Error deleting song references from playlists" });
      }

      // Step 2: Delete references from song_likes
      Song.deleteSongReferencesFromLikes(songId, (err) => {
        if (err) {
          console.error("Error deleting song references from likes:", err);
          return res
            .status(500)
            .json({ error: "Error deleting song references from likes" });
        }

        // Step 3: Delete references from album_songs
        Song.deleteSongReferencesFromAlbums(songId, (err) => {
          if (err) {
            console.error("Error deleting song references from albums:", err);
            return res
              .status(500)
              .json({ error: "Error deleting song references from albums" });
          }

          // Step 4: Delete the song itself
          Song.deleteSongById(songId, (err, result) => {
            if (err) {
              console.error("Error deleting song:", err);
              return res.status(500).json({ error: "Error deleting song" });
            }

            if (result.affectedRows === 0) {
              return res.status(404).json({ message: "Song not found" });
            }

            return res
              .status(200)
              .json({ message: "Song deleted successfully" });
          });
        });
      });
    });
  };

  if (role === "admin") {
    // Admins can delete any song
    deleteSongAndReferences();
  } else {
    // Authors can delete only their own songs
    Song.verifySongOwnership(songId, userId, (err, results) => {
      if (err) {
        console.error("Error verifying song ownership:", err);
        return res
          .status(500)
          .json({ error: "Error verifying song ownership" });
      }

      if (results.length === 0) {
        return res.status(403).json({
          error: "You can only delete songs you created",
        });
      }

      deleteSongAndReferences();
    });
  }
};

exports.updateSong = (req, res) => {
  const { id: userId, role } = req.user; // Extract user ID and role from the token
  const { id: songId } = req.params;
  const data = req.body;

  if (!songId) {
    return res.status(400).json({ error: "Song ID is required" });
  }

  const updateSong = () => {
    Song.updateSongById(songId, data, (err, result) => {
      if (err) {
        console.error("Error updating song:", err);
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

  if (role === "admin") {
    // Admins can update any song
    updateSong();
  } else {
    // Authors can update only their own songs
    Song.verifySongOwnership(songId, userId, (err, results) => {
      if (err) {
        console.error("Error verifying song ownership:", err);
        return res
          .status(500)
          .json({ error: "Error verifying song ownership" });
      }

      if (results.length === 0) {
        return res.status(403).json({
          error: "You can only update songs you created",
        });
      }

      updateSong();
    });
  }
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

exports.toggleLikeSong = (req, res) => {
  const userId = req.user.id;
  const { songId } = req.body;

  Song.checkLike(userId, songId, (err, results) => {
    if (err) {
      console.error("Error checking song like:", err);
      return res.status(500).json({ error: "Unable to toggle like for song" });
    }

    if (results.length > 0) {
      Song.removeLike(userId, songId, (err) => {
        if (err) {
          console.error("Error removing song like:", err);
          return res
            .status(500)
            .json({ error: "Unable to toggle like for song" });
        }

        Song.updateLikeCount(songId, (err) => {
          if (err) {
            console.error("Error updating song like count:", err);
            return res
              .status(500)
              .json({ error: "Unable to toggle like for song" });
          }

          res.json({ message: "Like removed successfully" });
        });
      });
    } else {
      Song.addLike(userId, songId, (err) => {
        if (err) {
          console.error("Error adding song like:", err);
          return res
            .status(500)
            .json({ error: "Unable to toggle like for song" });
        }

        Song.updateLikeCount(songId, (err) => {
          if (err) {
            console.error("Error updating song like count:", err);
            return res
              .status(500)
              .json({ error: "Unable to toggle like for song" });
          }

          res.json({ message: "Like added successfully" });
        });
      });
    }
  });
};
