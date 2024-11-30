import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./song-list.scss";

const SongsList = ({
  songs,
  artistNames,
  onSongClick,
  playlistId,
  onSongRemoved,
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(null); // Track the currently playing song
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing
  const audioRef = useRef(null);

  const handlePlayPause = (index) => {
    if (currentSongIndex === index) {
      // If the same song is clicked
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      // If a different song is clicked
      if (audioRef.current) {
        audioRef.current.pause(); // Pause any currently playing audio
        setIsPlaying(false);
      }

      setCurrentSongIndex(index); // Update the current song index
      const audioPath = require(`../../songs/${songs[index].location}`);

      if (audioPath && audioRef.current) {
        audioRef.current.src = audioPath; // Set the new audio source
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err);
        }); // Play the new song
        setIsPlaying(true);
      }
    }
  };

  const handleEnd = () => {
    if (currentSongIndex !== null && currentSongIndex < songs.length - 1) {
      handlePlayPause(currentSongIndex + 1); // Automatically play the next song
    } else {
      setIsPlaying(false);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      await axios.post("http://localhost:5000/api/playlists/remove-song", {
        playlistId,
        songId,
      });

      if (onSongRemoved) {
        onSongRemoved(songId); // Notify parent component to update song list
      }
    } catch (error) {
      console.error("Error removing song from playlist:", error);
    }
  };

  return (
    <div className="songs-list">
      <audio ref={audioRef} onEnded={handleEnd} controls></audio>
      <ul>
        {songs.map((song, index) => (
          <li
            key={song.song_id}
            className={`song-item ${
              currentSongIndex === index ? "active" : ""
            }`}
            onClick={() => onSongClick(song)} // Open song details on click
          >
            <div className="song-details">
              <div className="song-content">
                <span className="song-rank">{index + 1}</span>
                <div className="song-info">
                  <p className="song-title">{song.name}</p>
                  <p className="song-artist">
                    By {artistNames[song.artist_id] || "Unknown Artist"}
                  </p>
                </div>
              </div>
              <div className="song-actions">
                <button
                  className="song-play-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the song details on play button click
                    handlePlayPause(index);
                  }}
                >
                  {currentSongIndex === index && isPlaying ? "⏸" : "▶"}
                </button>
                <button
                  className="song-delete-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering song details on delete button click
                    handleDeleteSong(song.song_id);
                  }}
                >
                  🗑
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

SongsList.propTypes = {
  songs: PropTypes.arrayOf(
    PropTypes.shape({
      song_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      artist_id: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired, // Ensure song location is provided
    })
  ).isRequired,
  artistNames: PropTypes.object.isRequired,
  onSongClick: PropTypes.func.isRequired, // Callback for song click
  playlistId: PropTypes.number.isRequired, // Playlist ID for API request
  onSongRemoved: PropTypes.func, // Callback for when a song is removed
};

export default SongsList;
