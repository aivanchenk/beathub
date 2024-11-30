const express = require("express");
const router = express.Router();
const artistController = require("../controllers/ArtistContoller");

router.get("/top-artists", artistController.getTopArtists);

module.exports = router;
