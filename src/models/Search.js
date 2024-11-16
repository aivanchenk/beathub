const db = require("../config/db");

class Search {
  static search(input, callback) {
    const likeQuery = `%${input}%`;

    const sql = `
        SELECT 'song' AS type, song_id AS id, name AS title, likes_count 
        FROM songs 
        WHERE name LIKE ?
        UNION
        SELECT 'playlist' AS type, playlist_id AS id, name AS title, likes_count 
        FROM playlists 
        WHERE name LIKE ?
        UNION
        SELECT 'artist' AS type, artist_id AS id, name AS title, likes_count 
        FROM artists 
        WHERE name LIKE ?
        ORDER BY likes_count DESC
        LIMIT 20;
    `;

    db.query(sql, [likeQuery, likeQuery, likeQuery], (err, results) => {
      if (err) {
        console.error("SQL Execution Error:", err); // Log the error
        return callback(err, null);
      }
      callback(null, results);
    });
  }
}

module.exports = Search;
