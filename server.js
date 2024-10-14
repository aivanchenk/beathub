const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/UserRoutes");
const songRoutes = require("./src/routes/SongRoutes");
const playlistRoutes = require("./src/routes/PlaylistRouter");
const db = require("./src/config/db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Use the routes
app.use("/api/users", userRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
