import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import FallbackImage from "../../assests/icons/unnamed.jpg";

import "./song-details.scss";

const SongDetails = ({ id }) => {
  const [songDetails, setSongDetails] = useState(null);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        // Example API request to fetch song details
        const response = await axios.get(
          `http://localhost:5000/api/songs/${id}`
        );
        setSongDetails(response.data);
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };

    fetchSongDetails();
  }, [id]);

  if (!songDetails) return <p>Loading song details...</p>;

  return (
    <>
      <div className="song-details-container">
        <img
          src={require(`../../assests/posters/${songDetails.poster}`)}
          alt={songDetails.name}
          className="song-poster"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FallbackImage;
          }}
        />
        <h3>{songDetails.name}</h3>
        <p>Artist: {songDetails.artist_name || "Unknown Artist"}</p>
        <p>Genre: {songDetails.genre}</p>
        <p>Likes: {songDetails.likes_count}</p>
        <p>Plays: {songDetails.plays_count}</p>
      </div>
      <div className="song-details-container"></div>
    </>
  );
};

SongDetails.propTypes = {
  id: PropTypes.number.isRequired,
};

export default SongDetails;
