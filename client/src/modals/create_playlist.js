import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/low_level/button";
import "./create_playlist.scss";

const CreatePlaylistModal = ({
  isOpen,
  onClose,
  userId,
  playlistToUpdate = null, // Optional playlist data for updating
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (playlistToUpdate) {
      setName(playlistToUpdate.name || "");
      setDescription(playlistToUpdate.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [playlistToUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = playlistToUpdate
        ? `http://localhost:5000/api/playlists/${playlistToUpdate.playlist_id}` // Update endpoint
        : "http://localhost:5000/api/playlists"; // Create endpoint
      const method = playlistToUpdate ? "put" : "post";

      console.log("playlistToUpdate", playlistToUpdate);

      const response = await axios({
        method,
        url,
        data: {
          name,
          description,
          created_by: userId, // Only used for create
        },
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setMessage(response.data.message || "Operation successful!");
      setTimeout(() => {
        onClose(); // Close the modal after success
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{playlistToUpdate ? "Update Playlist" : "Create Playlist"}</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Playlist Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter playlist name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter playlist description"
              required
            ></textarea>
          </div>
          <div className="modal-actions">
            <Button type="submit primary" className="create-button">
              {playlistToUpdate ? "Update" : "Create"}
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

export default CreatePlaylistModal;
