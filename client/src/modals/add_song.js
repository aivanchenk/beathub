import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/low_level/button";
import "./create_playlist.scss";

const AddSongModal = ({ isOpen, onClose, songToUpdate = null }) => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");
  const [poster, setPoster] = useState(null);
  const [location, setLocation] = useState(null);
  const [artistId, setArtistId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
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
          setArtistId(artists[0].artist_id);
        } else {
          console.log(
            "Multiple or no artists found. Not selecting any artist."
          );
        }
      } catch (error) {
        console.error("Error fetching artist ID:", error);
        setMessage("Unable to fetch artist ID. Please try again later.");
      }
    };

    if (isOpen && !songToUpdate) {
      fetchArtistId();
    }
  }, [isOpen, songToUpdate]);

  useEffect(() => {
    if (songToUpdate) {
      setTitle(songToUpdate.name || "");
      setGenre(songToUpdate.genre || "");
      setDuration(songToUpdate.duration || "");
      setPoster(songToUpdate.poster || null);
      setLocation(songToUpdate.location || null);
    } else {
      setTitle("");
      setGenre("");
      setDuration("");
      setPoster(null);
      setLocation(null);
    }
  }, [songToUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!artistId && !songToUpdate) {
      setMessage("Artist ID is required to add or update a song.");
      return;
    }

    try {
      const url = songToUpdate
        ? `http://localhost:5000/api/songs/${songToUpdate.song_id}`
        : "http://localhost:5000/api/songs/";
      const method = songToUpdate ? "put" : "post";

      const data = {
        title,
        artist_id: artistId || songToUpdate.artist_id, // Use existing artist ID if updating
        genre,
        duration: parseInt(duration, 10), // Ensure duration is an integer
        ...(songToUpdate ? {} : { poster: poster?.name, location: location?.name }),
      };

      const response = await axios({
        method,
        url,
        data,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setMessage(response.data.message || "Operation successful!");
      setTimeout(() => {
        onClose(); // Close the modal after success
      }, 2000);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting song data:", error);
      setMessage("Failed to submit song data. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay add-song" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{songToUpdate ? "Update Song" : "Add a Song"}</h2>
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
          {!songToUpdate && (
            <>
              <div className="form-group">
                <label htmlFor="poster">Upload Poster</label>
                <input
                  type="file"
                  id="poster"
                  onChange={(e) => setPoster(e.target.files[0])}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Upload Audio</label>
                <input
                  type="file"
                  id="location"
                  onChange={(e) => setLocation(e.target.files[0])}
                  required
                />
              </div>
            </>
          )}
          <div className="modal-actions">
            <Button type="submit primary" className="add-song-button">
              {songToUpdate ? "Update Song" : "Add Song"}
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
