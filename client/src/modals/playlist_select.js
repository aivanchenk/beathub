import React, { useEffect, useState } from "react";
import axios from "axios";

import "./playlist_select.scss";

const PlaylistModal = ({ songId, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [message, setMessage] = useState("");

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

  const handleAddSongToPlaylist = async () => {
    if (!selectedPlaylistId) {
      setMessage("Please select a playlist.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/playlists/add-song",
        {
          playlistId: selectedPlaylistId,
          songId,
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      setMessage(response.data.msg || "Song added to playlist successfully!");
      setTimeout(() => onClose(), 2000); // Close modal after a short delay
    } catch (error) {
      if (error.response && error.response.data.msg) {
        setMessage(error.response.data.msg);
      } else {
        setMessage("Error adding song to playlist.");
      }
    }
  };

  return (
    <div className="playlist-modal">
      <div className="modal-content">
        <h3>Select a Playlist</h3>
        {message && <p>{message}</p>}
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.playlist_id}>
              <label>
                <input
                  type="radio"
                  name="playlist"
                  value={playlist.playlist_id}
                  onChange={() => setSelectedPlaylistId(playlist.playlist_id)}
                />
                {playlist.name}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={handleAddSongToPlaylist}>Add Song</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PlaylistModal;
