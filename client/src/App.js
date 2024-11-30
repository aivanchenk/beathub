import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./pages/main";
import MusicPlayer from "./pages/music_player";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/music-player" element={<MusicPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
