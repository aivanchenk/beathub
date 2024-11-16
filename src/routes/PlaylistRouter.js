const express = require("express");
const router = express.Router();
const PlaylistController = require("../controllers/PlaylistController");

router.get("/", PlaylistController.getAllPlaylists);
router.get("/:id", PlaylistController.getPlaylistById);
router.get("/:id/songs", PlaylistController.getSongsByPlaylistId);
router.post("/", PlaylistController.addPlaylist);
router.put("/:id", PlaylistController.updatePlaylistById);
router.delete("/:id", PlaylistController.deletePlaylist);

router.post("/add-song", PlaylistController.addSongToPlaylist);
router.post("/remove-song", PlaylistController.deleteSongFromPlaylist);

module.exports = router;
