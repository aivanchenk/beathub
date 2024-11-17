const Album = require("../models/Album");

exports.createAlbum = (req, res) => {
  const { id: userId, role: userRole } = req.user; // Extract authenticated user ID and role
  const {
    artistId,
    name,
    releaseDate,
    totalDuration,
    genre,
    description,
    songIds,
  } = req.body;

  if (!artistId || !name || !songIds || songIds.length === 0) {
    return res.status(400).json({
      error: "Artist ID, album name, and at least one song are required",
    });
  }

  // Step 1: Verify artist ownership or admin access
  Album.verifyArtistOwnershipForAdminOrAuthor(
    artistId,
    userId,
    userRole,
    (err, artistResults) => {
      if (err) {
        console.error("Error verifying artist ownership:", err);
        return res
          .status(500)
          .json({ error: "Database error while verifying artist ownership" });
      }

      if (artistResults.length === 0) {
        return res.status(403).json({
          error:
            "You can only create albums for your own artists or as an admin",
        });
      }

      // Step 2: Create the album
      Album.createAlbum(
        { artistId, name, releaseDate, totalDuration, genre, description },
        (err, albumResult) => {
          if (err) {
            console.error("Error creating album:", err);
            return res
              .status(500)
              .json({ error: "Database error while creating album" });
          }

          const albumId = albumResult.insertId;

          // Step 3: Associate songs with the album
          Album.addSongsToAlbum(albumId, songIds, (err) => {
            if (err) {
              console.error("Error adding songs to album:", err);
              return res
                .status(500)
                .json({ error: "Database error while adding songs to album" });
            }

            res
              .status(200)
              .json({ message: "Album created successfully", albumId });
          });
        }
      );
    }
  );
};

exports.editAlbum = (req, res) => {
  const { id: userId, role: userRole } = req.user; // Extract authenticated user ID and role
  const {
    albumId,
    name,
    releaseDate,
    totalDuration,
    genre,
    description,
    songIds,
  } = req.body;

  if (!albumId || !name || !songIds || songIds.length === 0) {
    return res.status(400).json({
      error: "Album ID, album name, and at least one song are required",
    });
  }

  // Step 1: Verify album ownership or admin access
  Album.verifyAlbumOwnershipForAdminOrAuthor(
    albumId,
    userId,
    userRole,
    (err, albumResults) => {
      if (err) {
        console.error("Error verifying album ownership:", err);
        return res
          .status(500)
          .json({ error: "Database error while verifying album ownership" });
      }

      if (albumResults.length === 0) {
        return res.status(403).json({
          error: "You can only edit albums for your own artists or as an admin",
        });
      }

      // Step 2: Update the album details
      Album.updateAlbum(
        albumId,
        { name, releaseDate, totalDuration, genre, description },
        (err) => {
          if (err) {
            console.error("Error updating album:", err);
            return res
              .status(500)
              .json({ error: "Database error while updating album" });
          }

          // Step 3: Replace associated songs
          Album.replaceSongsInAlbum(albumId, songIds, (err) => {
            if (err) {
              console.error("Error updating album songs:", err);
              return res
                .status(500)
                .json({ error: "Database error while updating album songs" });
            }

            res.status(200).json({ message: "Album updated successfully" });
          });
        }
      );
    }
  );
};

exports.getAlbumsByArtistId = (req, res) => {
  const { artistId } = req.params;

  if (!artistId) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  Album.getAlbumsByArtistId(artistId, (err, results) => {
    if (err) {
      console.error("Error fetching albums:", err);
      return res
        .status(500)
        .json({ error: "Database error while fetching albums" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No albums found for the given artist" });
    }

    res.status(200).json({ albums: results });
  });
};

exports.getAlbumWithSongs = (req, res) => {
  const { albumId } = req.params;

  if (!albumId) {
    return res.status(400).json({ error: "Album ID is required" });
  }

  // Step 1: Fetch album details
  Album.getAlbumById(albumId, (err, albumResults) => {
    if (err) {
      console.error("Error fetching album details:", err);
      return res
        .status(500)
        .json({ error: "Database error while fetching album details" });
    }

    if (albumResults.length === 0) {
      return res.status(404).json({ error: "Album not found" });
    }

    const album = albumResults[0];

    // Step 2: Fetch songs associated with the album
    Album.getSongsByAlbumId(albumId, (err, songResults) => {
      if (err) {
        console.error("Error fetching album songs:", err);
        return res
          .status(500)
          .json({ error: "Database error while fetching album songs" });
      }

      album.songs = songResults; // Add songs to album details

      res.status(200).json(album);
    });
  });
};

exports.deleteAlbum = (req, res) => {
  const { id: userId, role: userRole } = req.user; // Extract authenticated user's ID and role
  const { albumId } = req.params;

  if (!albumId) {
    return res.status(400).json({ error: "Album ID is required" });
  }

  // Step 1: Verify ownership or admin access
  Album.verifyAlbumOwnershipForAdminOrAuthor(
    albumId,
    userId,
    userRole,
    (err, albumResults) => {
      if (err) {
        console.error("Error verifying album ownership:", err);
        return res
          .status(500)
          .json({ error: "Database error while verifying album ownership" });
      }

      if (albumResults.length === 0) {
        return res.status(403).json({
          error: "You can only delete albums you created or as an admin",
        });
      }

      // Step 2: Delete associated songs
      Album.deleteAlbumSongs(albumId, (err) => {
        if (err) {
          console.error("Error deleting album songs:", err);
          return res
            .status(500)
            .json({ error: "Database error while deleting album songs" });
        }

        // Step 3: Delete the album itself
        Album.deleteAlbum(albumId, (err) => {
          if (err) {
            console.error("Error deleting album:", err);
            return res
              .status(500)
              .json({ error: "Database error while deleting album" });
          }

          res.status(200).json({ message: "Album deleted successfully" });
        });
      });
    }
  );
};
