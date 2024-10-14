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
    const { title, artist, album, genre, duration, added_by } = songData;
    const sql =
      "INSERT INTO songs (title, artist, album, genre, duration, added_by) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, artist, album, genre, duration, added_by], callback);
  }

  static updateSongById(songId, data, callback) {
    let sql = "UPDATE songs SET ";
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        sql += `${key} = ?, `;
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

  // Other song-related methods as needed
}

module.exports = Song;
