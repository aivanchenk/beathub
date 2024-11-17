const db = require("../config/db");

class User {
  static getAllUsers(callback) {
    db.query("SELECT * FROM users", callback);
  }

  static getUserById(userId, callback) {
    db.query("SELECT * FROM users WHERE user_id = ?", [userId], callback);
  }

  static getUserByEmail(userEmail, callback) {
    db.query("SELECT * FROM users WHERE email = ?", [userEmail], callback);
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

  static getUserByEmail(email, callback) {
    const sql = "SELECT * from users WHERE email = ?";
    db.query(sql, [email], callback);
  }

  static updateUserData(userId, updates, callback) {
    const fields = [];
    const values = [];

    if (updates.newUsername) {
      fields.push("username = ?");
      values.push(updates.newUsername);
    }

    if (updates.newEmail) {
      fields.push("email = ?");
      values.push(updates.newEmail);
    }

    if (fields.length === 0) {
      return callback({ message: "No fields to update" }, null);
    }

    const sql = `
      UPDATE users 
      SET ${fields.join(", ")} 
      WHERE user_id = ?;
    `;

    values.push(userId);

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("SQL Execution Error:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  }
}

module.exports = User;
