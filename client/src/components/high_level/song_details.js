import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import FeedbackItem from "../low_level/feedback";
import Notification from "../low_level/notification";
import Button from "../low_level/button";
import AddSongModal from "../../modals/add_song";
import { useAuth } from "../../contexts/auth_context";

import "./song-details.scss";

import FallbackImage from "../../assests/icons/unnamed.jpg";

const SongDetails = ({ id }) => {
  const [songDetails, setSongDetails] = useState(null);
  const [artistName, setArtistName] = useState("Unknown Artist");
  const [feedback, setFeedback] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [notification, setNotification] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const audioRef = useRef(null);
  const { userRole } = useAuth();

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/songs/${id}`
        );
        setSongDetails(response.data);
        if (response.data.artist_id) {
          const artistResponse = await axios.get(
            `http://localhost:5000/api/artists/${response.data.artist_id}`
          );
          setArtistName(artistResponse.data.name || "Unknown Artist");
        }
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };

    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/feedback/${id}`
        );
        setFeedback(response.data.feedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchSongDetails();
    fetchFeedback();
  }, [id]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setNotification({
        type: "error",
        message: "You must be logged in to submit feedback.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/feedback/add",
        {
          songId: id,
          feedbackText: newFeedback,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setFeedback((prevFeedback) => [
        ...prevFeedback,
        { ...response.data, user: "You", created_at: new Date().toISOString() },
      ]);
      setNewFeedback("");
      setNotification({
        type: "success",
        message: "Feedback submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setNotification({
        type: "error",
        message: "Failed to submit feedback. Please try again.",
      });
    }
  };

  const handleDeleteSong = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotification({
        type: "error",
        message: "You must be logged in to delete a song.",
      });
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/songs/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      setNotification({
        type: "success",
        message: "Song deleted successfully!",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting song:", error);
      setNotification({
        type: "error",
        message: "Failed to delete the song. Please try again.",
      });
    }
  };

  const handleUpdateSong = () => {
    setModalOpen(true);
  };

  const validateImagePath = (poster) => {
    try {
      return require(`../../assests/posters/${poster}`);
    } catch (error) {
      return FallbackImage;
    }
  };

  if (!songDetails) return <p>Loading song details...</p>;

  return (
    <>
      <div className="song-details-container">
        <img
          src={validateImagePath(songDetails.poster)}
          alt={songDetails.name}
          className="song-poster"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FallbackImage;
          }}
        />
        <h3>{songDetails.name}</h3>
        <p>Artist: {artistName}</p>
        <p>Genre: {songDetails.genre}</p>
        <p>Likes: {songDetails.likes_count}</p>
        <p>Plays: {songDetails.plays_count}</p>

        <div className="audio-player">
          <audio
            ref={audioRef}
            src={require(`../../songs/${songDetails.location}`)}
            preload="metadata"
            onEnded={() => setIsPlaying(false)}
            controls
          />
          <button className="play-pause-button" onClick={handlePlayPause}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>
      </div>

      {(userRole === "author" || userRole === "admin") && (
        <div className="song-actions">
          <Button onClick={handleUpdateSong}>Update</Button>
          <button className="song-delete-button" onClick={handleDeleteSong}>
            Delete
          </button>
        </div>
      )}

      <div className="feedback-section">
        <h4>Feedback</h4>
        <form className="feedback-form" onSubmit={handleSubmitFeedback}>
          <textarea
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            placeholder="Write your feedback..."
            required
          />
          <Button type="primary submit">Submit Feedback</Button>
        </form>

        {feedback.length > 0 ? (
          <ul className="feedback-list">
            {feedback.map((fb, index) => (
              <FeedbackItem
                key={fb.feedback_id || `fb-${index}`}
                feedback={fb}
              />
            ))}
          </ul>
        ) : (
          <p>No feedback available for this song.</p>
        )}
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <AddSongModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        songToUpdate={songDetails} // Pass song details for updating
      />
    </>
  );
};

export default SongDetails;
