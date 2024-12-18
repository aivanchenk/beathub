const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const auth = require("../middleware/auth");

router.get("/:id", UserController.getUserbyId);
router.get("/", UserController.getAllUsers);
router.put("/:id", UserController.updateUserById);
router.post("/", UserController.addUser);
router.delete("/:id", auth, UserController.deleteUser);
router.get("/:id/collections", UserController.getSongsAndPlaylistsByUserId);

router.get(
  "/:id/songs-and-playlists",
  UserController.getSongsAndPlaylistsByUserId
);

router.post("/user-data", auth, UserController.updateUserData);
router.post("/update-role", auth, UserController.updateUserRole);
router.post("/role", auth, UserController.getUserRoleByToken);

module.exports = router;
