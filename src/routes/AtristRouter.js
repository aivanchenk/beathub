const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const artistController = require("../controllers/ArtistContoller");

router.get("/top-artists", artistController.getTopArtists);
router.get("/:id", artistController.getArtistById);
router.get("/songs/:id", artistController.getSongsByArtist);
router.post("/my-artist", auth, artistController.getArtistsByUser);

module.exports = router;
