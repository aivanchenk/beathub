import React, { useEffect, useState } from "react";
import axios from "axios";

import FallbackImage from "../../assests/icons/unnamed.jpg";

import "./your-playlists.scss";

const YourPlaylists = ({ onCardClick }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/playlists/my-playlists",
          {},
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        );
        setPlaylists(response.data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, []);

  const validateImagePath = (poster) => {
    try {
      return require(`../../assests/playlists/${poster}`);
    } catch (error) {
      return FallbackImage;
    }
  };

  return (
    <div className="your-playlists">
      <div className="header">
        <h2>Your Playlists</h2>
      </div>
      <div className="playlists-list">
        {playlists.length === 0 ? (
          <p>No playlists found.</p>
        ) : (
          playlists.map((playlist) => (
            <div
              key={playlist.playlist_id}
              className="playlist-card"
              onClick={() => onCardClick(playlist, "playlist")}
            >
              <img
                src={validateImagePath(playlist.poster)}
                alt={`${playlist.name} Poster`}
                className="playlist-poster"
              />
              <div className="playlist-info">
                <p className="playlist-name">{playlist.name}</p>
                <p className="playlist-description">{playlist.description}</p>
                <p className="playlist-songs">{playlist.song_count} Songs</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default YourPlaylists;
