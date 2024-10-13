import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/songs");
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  console.log(songs);

  return (
    <div>
      <h1>Songs List</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.song_id}>{song.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
