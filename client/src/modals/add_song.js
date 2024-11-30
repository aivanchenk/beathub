import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/low_level/button";
import "./create_playlist.scss";

const AddSongModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");
  const [artistId, setArtistId] = useState(null);
  const [message, setMessage] = useState("");

  // Reusable function to fetch the artist ID
  const fetchArtistId = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/artists/my-artist",
        {},
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      const artists = response.data.artists;
      if (Array.isArray(artists) && artists.length === 1) {
        return artists[0].artist_id;
      } else {
        console.log("Multiple or no artists found. Not selecting any artist.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching artist ID:", error);
      setMessage("Unable to fetch artist ID. Please try again later.");
      return null;
    }
  };

  // Fetch artist ID when the modal is opened
  useEffect(() => {
    if (isOpen) {
      (async () => {
        const fetchedArtistId = await fetchArtistId();
        setArtistId(fetchedArtistId);
      })();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!artistId) {
      setMessage("Artist ID is required to add a song.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/songs/",
        {
          title,
          artist_id: artistId,
          genre,
          duration: parseInt(duration, 10), // Ensure duration is an integer
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      setMessage(response.data.message || "Song added successfully!");
      setTimeout(() => {
        onClose(); // Close the modal after success
      }, 2000);
    } catch (error) {
      console.error("Error adding song:", error);
      setMessage("Failed to add the song. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay add-song" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add a Song</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Song Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Enter song genre"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration (seconds)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter song duration"
              required
            />
          </div>
          <div className="modal-actions">
            <Button type="submit primary" className="add-song-button">
              Add Song
            </Button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongModal;
