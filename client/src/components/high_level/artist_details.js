import React, { useEffect, useState } from "react";
import axios from "axios";
import FallbackImage from "../../assests/icons/unnamed.jpg";
import SongsList from "../low_level/song-list"; // Reusing SongsList component
import "./artist-details.scss";

const ArtistDetails = ({ id }) => {
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]); // State to store songs by the artist

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/artists/${id}`
        );
        setArtist(response.data);
      } catch (error) {
        console.error("Error fetching artist details:", error);
      }
    };

    const fetchSongsByArtist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/artists/songs/${id}`
        );
        setSongs(response.data.songs);
      } catch (error) {
        console.error("Error fetching songs by artist:", error);
      }
    };

    fetchArtist();
    fetchSongsByArtist();
  }, [id]);

  const handleSongClick = (song) => {
    console.log("Song clicked:", song);
  };

  if (!artist) return <p>Loading artist details...</p>;

  return (
    <div className="artist-details-container">
      <img
        src={require(`../../assests/artists/${artist.poster}`)}
        alt={artist.name}
        className="artist-poster"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FallbackImage;
        }}
      />
      <h3>{artist.name}</h3>
      <p className="artist-bio">{artist.bio}</p>
      <p className="artist-likes">Likes: {artist.likes_count}</p>

      <div className="artist-songs-section">
        <SongsList
          songs={songs}
          artistNames={{ [id]: artist.name }}
          onSongClick={handleSongClick}
          playlistId={null}
          onSongRemoved={() => {}}
        />
      </div>
    </div>
  );
};

export default ArtistDetails;
