const db = require("../config/db");

class Playlist {
  static getPlaylistsByUserId(userId, callback) {
    const sql = `
    SELECT p.playlist_id, p.name, p.description, p.created_by, p.created_at,
    COUNT(ps.song_id) AS song_count
    FROM playlists p
    LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
    WHERE p.created_by = ?
    GROUP BY p.playlist_id
  `;
    db.query(sql, [userId], callback);
  }

  static getAllPlaylists(callback) {
    db.query("SELECT * FROM playlists", callback);
  }

  static getPlaylistById(playlistId, callback) {
    db.query(
      "SELECT * FROM playlists WHERE playlist_id = ?",
      [playlistId],
      callback
    );
  }

  static addPlaylist(playlistData, callback) {
    const { name, description, created_by } = playlistData;
    const sql =
      "INSERT INTO playlists (name, description, created_by) VALUES (?, ?, ?)";
    db.query(sql, [name, description, created_by], callback);
  }

  static updatePlaylistById(playlistId, data, callback) {
    let sql = "UPDATE playlists SET ";
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        sql += `${key} = ?, `;
        values.push(value);
      }
    }

    sql = sql.slice(0, -2); // Remove the last comma and space
    sql += " WHERE playlist_id = ?";
    values.push(playlistId);

    db.query(sql, values, callback);
  }

  static deletePlaylistById(playlistId, callback) {
    const sql = "DELETE FROM playlists WHERE playlist_id = ?";
    db.query(sql, [playlistId], callback);
  }

  static addSongToPlaylist(playlistId, songId, callback) {
    const sql =
      "INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)";
    db.query(sql, [playlistId, songId], callback);
  }

  static removeSongFromPlaylist(playlistId, songId, callback) {
    const sql =
      "DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?";
    db.query(sql, [playlistId, songId], callback);
  }

  static isSongInPlaylist(playlistId, songId, callback) {
    const sql =
      "SELECT * FROM playlist_songs WHERE playlist_id = ? AND song_id = ?";
    db.query(sql, [playlistId, songId], callback);
  }
}

module.exports = Playlist;
