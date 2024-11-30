import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePlaylistModal from "../../modals/create_playlist";
import Button from "../low_level/button";
import SongsList from "../low_level/song-list";

import FallbackImage from "../../assests/icons/unnamed.jpg";
import "./playlist_details.scss";

const PlaylistDetails = ({ id, onPlaylistDelete, onSongClick }) => {
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [artistNames, setArtistNames] = useState({});

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

        // Fetch artist names for each song
        const artistIds = response.data.map((song) => song.artist_id);
        const artistNamesMap = {};

        await Promise.all(
          artistIds.map(async (artistId) => {
            if (!artistNamesMap[artistId]) {
              try {
                const artistResponse = await axios.get(
                  `http://localhost:5000/api/artists/${artistId}`
                );
                artistNamesMap[artistId] = artistResponse.data.name;
              } catch (error) {
                console.error(
                  `Error fetching artist with ID ${artistId}:`,
                  error
                );
              }
            }
          })
        );

        setArtistNames(artistNamesMap);
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

  const validateImagePath = (poster) => {
    try {
      return require(`../../assests/playlists/${poster}`);
    } catch (error) {
      return FallbackImage;
    }
  };

  if (!playlist) return <p>Loading playlist details...</p>;

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

      <SongsList
        songs={songs}
        artistNames={artistNames}
        onSongClick={onSongClick}
      />

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        playlistToUpdate={playlist}
      />
    </div>
  );
};

export default PlaylistDetails;
