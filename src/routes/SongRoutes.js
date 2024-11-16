const express = require("express");
const router = express.Router();
const SongController = require("../controllers/SongController");
const auth = require("../middleware/auth");

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ msg: "Access forbidden: insufficient permissions" });
  }
  next();
};

router.get("/:id", SongController.getSongById);
router.get("/", SongController.getAllSongs);
router.post("/", auth, authorize(["author"]), SongController.addSong);
router.put("/:id", SongController.updateSong);
router.delete("/:id", SongController.deleteSong);

module.exports = router;
