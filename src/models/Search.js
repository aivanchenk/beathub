const db = require("../config/db");

class Search {
  static search(input, callback) {
    const likeQuery = `%${input}%`;

    const sql = `
    SELECT CAST('song' AS CHAR) COLLATE utf8mb4_general_ci AS type, 
           song_id AS id, 
           CAST(name AS CHAR) COLLATE utf8mb4_general_ci AS title, 
           likes_count, 
           CAST(poster AS CHAR) COLLATE utf8mb4_general_ci AS poster, 
           CAST(location AS CHAR) COLLATE utf8mb4_general_ci AS location
    FROM songs
    WHERE name LIKE ?
    UNION
    SELECT CAST('playlist' AS CHAR) COLLATE utf8mb4_general_ci AS type, 
           playlist_id AS id, 
           CAST(name AS CHAR) COLLATE utf8mb4_general_ci AS title, 
           likes_count, 
           CAST(poster AS CHAR) COLLATE utf8mb4_general_ci AS poster, 
           NULL AS location
    FROM playlists
    WHERE name LIKE ?
    UNION
    SELECT CAST('artist' AS CHAR) COLLATE utf8mb4_general_ci AS type, 
           artist_id AS id, 
           CAST(name AS CHAR) COLLATE utf8mb4_general_ci AS title, 
           likes_count, 
           NULL AS poster, 
           NULL AS location
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
