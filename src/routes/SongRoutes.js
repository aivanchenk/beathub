const express = require("express");
const router = express.Router();
const SongController = require("../controllers/SongController");

router.get("/:id", SongController.getSongById);
router.get("/", SongController.getAllSongs);
router.post("/", SongController.addSong);
router.put("/:id", SongController.updateSong);
router.delete("/:id", SongController.deleteSong);

module.exports = router;
