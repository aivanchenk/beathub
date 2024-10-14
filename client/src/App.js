import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListenerPage from "./pages/listener";
import PlaylistDetail from "./pages/playlist";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListenerPage />} />{" "}
        <Route path="/playlists/:id" element={<PlaylistDetail />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
