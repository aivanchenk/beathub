const db = require("../config/db");

class Artist {
  static getTopArtists(callback) {
    const sql = `
      SELECT artist_id, user_id, name, bio, likes_count, poster, created_at
      FROM artists
      ORDER BY likes_count DESC
      LIMIT 10;
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching top artists:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  }

  static getArtistById(artistId, callback) {
    const sql = `
      SELECT artist_id, user_id, name, bio, likes_count, poster, created_at
      FROM artists
      WHERE artist_id = ?;
    `;

    db.query(sql, [artistId], (err, results) => {
      if (err) {
        console.error("Error fetching artist by ID:", err);
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  }

  static getSongsByArtist(artistId, callback) {
    const sql = `
      SELECT 
        song_id, artist_id, name, genre, duration, plays_count, likes_count, poster, location, added_by, added_at
      FROM 
        songs
      WHERE 
        artist_id = ?;
    `;

    db.query(sql, [artistId], (err, results) => {
      if (err) {
        console.error("Error fetching songs by artist:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  }

  static getArtistByUserId(userId, callback) {
    const sql = "SELECT * FROM artists WHERE user_id = ?";
    db.query(sql, [userId], callback);
  }
}

module.exports = Artist;
