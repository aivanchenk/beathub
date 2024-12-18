const db = require("../config/db");

class Song {
  static getAllSongs(callback) {
    db.query("SELECT * FROM songs", callback);
  }

  static getSongById(songId, callback) {
    db.query("SELECT * FROM songs WHERE song_id = ?", [songId], callback);
  }

  static getSongsByUserId(userId, callback) {
    db.query("SELECT * FROM songs WHERE added_by = ?", [userId], callback);
  }

  static getSongsByPlaylistId(playlistId, callback) {
    const query = `
        SELECT s.* 
        FROM songs s 
        JOIN playlist_songs ps ON s.song_id = ps.song_id 
        WHERE ps.playlist_id = ?;
    `;
    db.query(query, [playlistId], callback);
  }

  static addSong(songData, callback) {
    const { title, artist_id, genre, duration, added_by, poster, location } =
      songData;
    const sql =
      "INSERT INTO songs (name, artist_id, genre, duration, added_by, poster, location) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [title, artist_id, genre, duration, added_by, poster, location],
      callback
    );
  }

  static updateSongById(songId, data, callback) {
    let sql = "UPDATE songs SET ";
    const values = [];

    // Correct the mapping for keys if necessary
    const columnMapping = {
      title: "name",
      genre: "genre",
      duration: "duration",
      artist_id: "artist_id",
    };

    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && columnMapping[key]) {
        sql += `${columnMapping[key]} = ?, `;
        values.push(value);
      }
    }

    sql = sql.slice(0, -2);
    sql += " WHERE song_id = ?";
    values.push(songId);

    db.query(sql, values, callback);
  }

  static deleteSongById(songId, callback) {
    const sql = "DELETE FROM songs WHERE song_id = ?";
    db.query(sql, [songId], callback);
  }

  static checkLike(userId, songId, callback) {
    const sql = `
      SELECT * FROM song_likes WHERE user_id = ? AND song_id = ?
    `;
    db.query(sql, [userId, songId], callback);
  }

  static addLike(userId, songId, callback) {
    const sql = `
      INSERT INTO song_likes (user_id, song_id, liked_at)
      VALUES (?, ?, NOW());
    `;
    db.query(sql, [userId, songId], callback);
  }

  static removeLike(userId, songId, callback) {
    const sql = `
      DELETE FROM song_likes WHERE user_id = ? AND song_id = ?
    `;
    db.query(sql, [userId, songId], callback);
  }

  static updateLikeCount(songId, callback) {
    const sql = `
      UPDATE songs
      SET likes_count = (
        SELECT COUNT(*) FROM song_likes WHERE song_id = ?
      )
      WHERE song_id = ?;
    `;
    db.query(sql, [songId, songId], callback);
  }

  static verifySongOwnership(songId, userId, callback) {
    const sql = `
    SELECT * FROM songs WHERE song_id = ? AND added_by = ?
  `;
    db.query(sql, [songId, userId], callback);
  }

  static deleteSongReferencesFromPlaylists(songId, callback) {
    const sql = `
      DELETE FROM playlist_songs WHERE song_id = ?
    `;
    db.query(sql, [songId], callback);
  }

  // Delete references to the song in song_likes
  static deleteSongReferencesFromLikes(songId, callback) {
    const sql = `
      DELETE FROM song_likes WHERE song_id = ?
    `;
    db.query(sql, [songId], callback);
  }

  static deleteSongReferencesFromAlbums(songId, callback) {
    const sql = `
      DELETE FROM album_songs WHERE song_id = ?
    `;
    db.query(sql, [songId], callback);
  }
}

module.exports = Song;
