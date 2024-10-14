// PlaylistDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Aside from "../components/Wrappers/aside";
import Card from "../components/Wrappers/card";

import styles from "./styles.module.scss";

function PlaylistDetail() {
  const { id } = useParams(); // Get the playlist ID from the URL
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        // Fetch the playlist details
        const playlistResponse = await axios.get(
          `http://localhost:5000/api/playlists/${id}`
        );
        setPlaylist(playlistResponse.data);

        // Fetch songs for this playlist
        const songsResponse = await axios.get(
          `http://localhost:5000/api/playlists/${id}/songs`
        );
        setSongs(songsResponse.data); // Set the songs state
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  const handleDelete = async (songId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/playlists/${id}/songs/${songId}`
      );

      setSongs(songs.filter((song) => song.song_id !== songId));
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  if (!playlist) {
    return <div>Loading playlist details...</div>; // Loading state
  }

  return (
    <div className={styles.page}>
      <Aside>
        <h1>{playlist.name}</h1>
        <p>Total songs: {songs.length}</p>
        <p>Created: {formatDate(playlist.created_at)}</p>
        <p>{playlist.description}</p>
      </Aside>
      <main>
        <h2>Songs in this Playlist:</h2>
        <Card>
          {songs.length > 0 ? (
            songs.map((song) => (
              <div
                key={song.song_id}
                className={`${styles.card} ${styles.el1}`}
              >
                <div className={styles.headerRow}>
                  <h2>{song.title}</h2>
                  <button
                    className={styles.delete}
                    onClick={() => handleDelete(song.song_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <li>No songs found in this playlist.</li>
          )}
        </Card>
      </main>
    </div>
  );
}

export default PlaylistDetail;
