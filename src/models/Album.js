const db = require("../config/db");

class Album {
  // Verify that the artist belongs to the authenticated user
  static verifyAlbumOwnershipForAdminOrAuthor(
    albumId,
    userId,
    userRole,
    callback
  ) {
    if (userRole === "admin") {
      // Admin can access any album
      return callback(null, [{ adminAccess: true }]);
    }

    // Check ownership for authors
    const sql = `
      SELECT a.*
      FROM albums a
      JOIN artists ar ON a.artist_id = ar.artist_id
      WHERE a.album_id = ? AND ar.user_id = ?
    `;
    db.query(sql, [albumId, userId], callback);
  }

  static verifyArtistOwnershipForAdminOrAuthor(
    artistId,
    userId,
    userRole,
    callback
  ) {
    if (userRole === "admin") {
      // Admin can access any artist
      return callback(null, [{ adminAccess: true }]);
    }

    // Check ownership for authors
    const sql = `
      SELECT * FROM artists WHERE artist_id = ? AND user_id = ?
    `;
    db.query(sql, [artistId, userId], callback);
  }

  // Create a new album
  static createAlbum(data, callback) {
    const { artistId, name, releaseDate, totalDuration, genre, description } =
      data;
    const sql = `
      INSERT INTO albums (artist_id, name, release_date, total_duration, genre, description, likes_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, NOW())
    `;
    db.query(
      sql,
      [artistId, name, releaseDate, totalDuration, genre, description],
      callback
    );
  }

  // Associate songs with the album
  static addSongsToAlbum(albumId, songIds, callback) {
    const values = songIds.map((songId) => [albumId, songId]);
    const sql = `
      INSERT INTO album_songs (album_id, song_id)
      VALUES ?
    `;
    db.query(sql, [values], callback);
  }
  static updateAlbum(albumId, data, callback) {
    const { name, releaseDate, totalDuration, genre, description } = data;
    const sql = `
      UPDATE albums
      SET name = ?, release_date = ?, total_duration = ?, genre = ?, description = ?
      WHERE album_id = ?
    `;
    db.query(
      sql,
      [name, releaseDate, totalDuration, genre, description, albumId],
      callback
    );
  }

  // Replace songs associated with the album
  static replaceSongsInAlbum(albumId, songIds, callback) {
    // Delete existing songs for the album
    const deleteSql = `
      DELETE FROM album_songs WHERE album_id = ?
    `;

    db.query(deleteSql, [albumId], (err) => {
      if (err) return callback(err);

      // Insert the new songs
      const values = songIds.map((songId) => [albumId, songId]);
      const insertSql = `
        INSERT INTO album_songs (album_id, song_id)
        VALUES ?
      `;
      db.query(insertSql, [values], callback);
    });
  }

  static getAlbumsByArtistId(artistId, callback) {
    const sql = `
      SELECT album_id, name, release_date, total_duration, genre, description, likes_count, created_at
      FROM albums
      WHERE artist_id = ?
      ORDER BY created_at DESC
    `;
    db.query(sql, [artistId], callback);
  }

  static getAlbumById(albumId, callback) {
    const sql = `
      SELECT album_id, artist_id, name, release_date, total_duration, genre, description, likes_count, created_at
      FROM albums
      WHERE album_id = ?
    `;
    db.query(sql, [albumId], callback);
  }

  // Fetch songs associated with an album
  static getSongsByAlbumId(albumId, callback) {
    const sql = `
    SELECT s.song_id, s.name AS song_name, s.genre, s.duration, s.likes_count, s.plays_count, s.added_at
    FROM album_songs als
    JOIN songs s ON als.song_id = s.song_id
    WHERE als.album_id = ?
  `;
    db.query(sql, [albumId], callback);
  }

  static deleteAlbumSongs(albumId, callback) {
    const sql = `
      DELETE FROM album_songs WHERE album_id = ?
    `;
    db.query(sql, [albumId], callback);
  }

  static deleteAlbum(albumId, callback) {
    const sql = `
      DELETE FROM albums WHERE album_id = ?
    `;
    db.query(sql, [albumId], callback);
  }
}

module.exports = Album;
