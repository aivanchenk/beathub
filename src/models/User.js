const db = require("../config/db");

class User {
  static getAllUsers(callback) {
    db.query("SELECT * FROM users", callback);
  }

  static getUserById(userId, callback) {
    db.query("SELECT * FROM users WHERE user_id = ?", [userId], callback);
  }

  static addUser(userData, callback) {
    const { username, email, password_hash, role } = userData;
    const sql =
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [username, email, password_hash, role], callback);
  }

  static updateUserById(songId, data, callback) {
    let sql = "UPDATE users SET ";
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        sql += `${key} = ?, `;
        values.push(value);
      }
    }

    if (values.length === 0) {
      return callback(null, { affectedRows: 0 });
    }

    sql = sql.slice(0, -2);
    sql += " WHERE user_id = ?";
    values.push(songId);

    db.query(sql, values, callback);
  }

  static deletUserById(songId, callback) {
    const sql = "DELETE FROM users WHERE user_id = ?";
    db.query(sql, [songId], callback);
  }

  //Other user-related methods
}

module.exports = User;
