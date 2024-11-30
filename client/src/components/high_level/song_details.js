import React, { useEffect, useState } from "react";
import axios from "axios";

const SongDetails = ({ id }) => {
  const [song, setSong] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/songs/${id}`
        );
        setSong(response.data);
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };

    fetchSong();
  }, [id]);

  if (!song) return <p>Loading song details...</p>;

  return (
    <div>
      <h3>{song.name}</h3>
      <p>Artist: {song.artist_name}</p>
      <p>Duration: {song.duration} mins</p>
    </div>
  );
};

export default SongDetails;
