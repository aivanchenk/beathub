import React, { useRef, useState } from "react";
import "./author_card.scss";

const AuthorCard = ({ image, name, audioSrc }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="author-card">
      <div className="image-container">
        <img
          src={image}
          alt={name}
          className="image"
          onClick={handlePlayPause}
        />
        <div className="play-button" onClick={handlePlayPause}>
          <span>{isPlaying ? "⏸" : "▶"}</span>
        </div>
      </div>
      <p className="author-name">{name}</p>
      <audio ref={audioRef} src={audioSrc}></audio>
    </div>
  );
};

export default AuthorCard;
