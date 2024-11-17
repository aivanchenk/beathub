const User = require("../models/User");
const Song = require("../models/Song");
const Playlist = require("../models/Playlist");
const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT_ROUNDS || 10;

exports.getAllUsers = (req, res) => {
  User.getAllUsers((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

exports.getSongsAndPlaylistsByUserId = (req, res) => {
  const userId = req.params.id;

  Song.getSongsByUserId(userId, (err, songs) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching songs" });
    }

    Playlist.getPlaylistsByUserId(userId, (err, playlists) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching playlists" });
      }

      res.status(200).json({
        songs,
        playlists,
      });
    });
  });
};

exports.getUserbyId = (req, res) => {
  const userId = req.params.id;

  User.getUserById(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result[0]);
  });
};

exports.updateUserById = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  User.updateUserById(id, data, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error updating user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
    });
  });
};

exports.addUser = async (req, res) => {
  const userData = req.body;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
  userData.password_hash = hashedPassword;

  User.addUser(userData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error adding user" });
    }

    res.status(201).json({
      message: "User added successfully",
      userId: result.insertId,
    });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  User.deletUserById(id, (err, result) => {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error: "Cannot delete user",
        });
      }
      return res.status(500).json({ error: "Error deleting user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({
      message: "User deleted successfully",
    });
  });
};

exports.updateUserData = (req, res) => {
  const userId = req.user.id;
  const { newUsername, newEmail } = req.body;

  if (!newUsername && !newEmail) {
    return res.status(400).json({ error: "New username or email is required" });
  }

  User.updateUserData(userId, { newUsername, newEmail }, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User data updated successfully" });
  });
};