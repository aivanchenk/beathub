const express = require("express");
const router = express.Router();
const AlbumController = require("../controllers/AlbumController");
const authenticateToken = require("../middleware/auth");

router.post("/create", authenticateToken, AlbumController.createAlbum);
router.put("/edit", authenticateToken, AlbumController.editAlbum);
router.get("/artist/:artistId", AlbumController.getAlbumsByArtistId);
router.get("/:albumId", AlbumController.getAlbumWithSongs);
router.delete("/:albumId", authenticateToken, AlbumController.deleteAlbum);

module.exports = router;
