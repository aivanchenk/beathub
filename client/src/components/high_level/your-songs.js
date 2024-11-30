import React, { useEffect, useState } from "react";
import axios from "axios";

import FallbackImage from "../../assests/icons/unnamed.jpg";

import "./your-playlists.scss";

const UserSongs = ({ onCardClick }) => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/songs/user-songs",
          {}, // Pass an empty body for the POST request
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        );
        setSongs(response.data.songs);
      } catch (error) {
        console.error("Error fetching user songs:", error);
      }
    };

    fetchSongs();
  }, []);

  const validateImagePath = (poster) => {
    try {
      return require(`../../assests/posters/${poster}`);
    } catch (error) {
      return FallbackImage;
    }
  };

  return (
    <div className="your-playlists">
      <div className="header">
        <h2>Your Songs</h2>
      </div>
      <div className="playlists-list">
        {songs.length === 0 ? (
          <p>No songs found.</p>
        ) : (
          songs.map((song) => (
            <div
              key={song.song_id}
              className="playlist-card"
              onClick={() => onCardClick(song, "song")}
            >
              <img
                src={validateImagePath(song.poster)}
                alt={`${song.name} Poster`}
                className="playlist-poster"
              />
              <div className="playlist-info">
                <p className="playlist-name">{song.name}</p>
                <p className="playlist-description">{song.genre}</p>
                <p className="playlist-songs">{song.likes_count} Likes</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserSongs;
