import React, { useEffect, useState } from "react";
import axios from "axios";

import FallbackImage from "../../assests/icons/unnamed.jpg";

import "./top-artists.scss";

const TopArtists = ({ onCardClick }) => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // Fetch top artists from the API
    const fetchTopArtists = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/artists/top-artists"
        );
        setArtists(response.data); // Update state with the top artists
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    };

    fetchTopArtists();
  }, []);

  const validateImagePath = (poster) => {
    try {
      return require(`../../assests/artists/${poster}`);
    } catch (error) {
      return FallbackImage;
    }
  };

  return (
    <div className="top-artists">
      <div className="header">
        <h2>Top Artists</h2>
      </div>
      <div className="artists-list">
        {artists.map((artist) => (
          <div
            key={artist.artist_id}
            className="artist-card"
            onClick={() => onCardClick(artist, "artist")}
          >
            <img
              src={validateImagePath(artist.poster)}
              alt={`${artist.name} Poster`}
              className="artist-poster"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FallbackImage;
              }}
            />
            <div className="artist-info">
              <p className="artist-name">{artist.name}</p>
              <p className="artist-plays">{artist.likes_count} likes</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArtists;
