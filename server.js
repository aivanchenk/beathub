const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/UserRoutes");
const songRoutes = require("./src/routes/SongRoutes");
const playlistRoutes = require("./src/routes/PlaylistRouter");
const authRoutes = require("./src/routes/AuthRouter");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(express.json({ extended: false }));

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// console.log(process.env);

// Use the routes
app.use("/api/users", userRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
