import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePlaylistModal from "../../modals/create_playlist";
import Button from "../low_level/button";
import FallbackImage from "../../assests/icons/unnamed.jpg";
import "./playlist_details.scss";

const PlaylistDetails = ({ id, onPlaylistDelete }) => {
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false); // Manage modal visibility

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/playlists/${id}`
        );
        setPlaylist(response.data);
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      }
    };

    const fetchSongs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/playlists/${id}/songs`
        );
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchPlaylist();
    fetchSongs();
  }, [id]);

  const handleDeletePlaylist = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/playlists/${id}`
      );
      setMessage(response.data.message);
      if (onPlaylistDelete) {
        onPlaylistDelete();
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      setMessage("Failed to delete playlist.");
    }
  };

  if (!playlist) return <p>Loading playlist details...</p>;

  const validateImagePath = (poster) => {
    try {
      return require(`../../assests/playlists/${poster}`);
    } catch (error) {
      return FallbackImage;
    }
  };

  console.log(playlist.id);

  return (
    <div className="playlist-details">
      <div className="playlist-info">
        <img
          src={validateImagePath(playlist.poster)}
          alt={`${playlist.name} Poster`}
          className="playlist-poster"
        />
        <h3>{playlist.name}</h3>
        <p>{playlist.description}</p>
        <Button className="update-button" onClick={() => setModalOpen(true)}>
          Update Playlist
        </Button>
        <button className="delete-button" onClick={handleDeletePlaylist}>
          Delete Playlist
        </button>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="songs-list">
        <h4>Top Songs</h4>
        {songs.length > 0 ? (
          <ul>
            {songs.map((song, index) => (
              <li key={song.song_id} className="song-item">
                <div className="song-details">
                  <span className="song-rank">{index + 1}</span>
                  <img
                    src={`/images/songs/${song.poster}`}
                    alt={song.name}
                    className="song-poster"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FallbackImage;
                    }}
                  />
                  <div className="song-info">
                    <p className="song-title">{song.name}</p>
                    <p className="song-artist">By Artist {song.artist_id}</p>
                  </div>
                </div>
                <div className="song-meta">
                  <p className="song-duration">
                    {formatDuration(song.duration)}
                  </p>
                  <button className="song-play-button">▶</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No songs found in this playlist.</p>
        )}
      </div>

      {/* Update Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        playlistToUpdate={playlist} // Pass playlist data for update
      />
    </div>
  );
};

const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default PlaylistDetails;
