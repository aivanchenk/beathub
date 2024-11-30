const express = require("express");
const router = express.Router();
const SongController = require("../controllers/SongController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/roleAuth");

router.get("/:id", SongController.getSongById);
router.get("/", SongController.getAllSongs);

router.post("/", auth, authorize(["author", "admin"]), SongController.addSong);
router.put("/:id", auth, SongController.updateSong);
router.delete("/:id", auth, SongController.deleteSong);

router.post("/like", auth, SongController.toggleLikeSong);
router.post("/user-songs", auth, SongController.getSongsByUser);

module.exports = router;
