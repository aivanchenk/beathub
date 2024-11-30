import React, { useRef, useState } from "react";
import Waves from "../../assests/main_page/waves.png";
import Song from "../../songs/lisa_crossing_field.mp3";
import "./now_playing.scss";

const NowPlaying = () => {
  const audioRef = useRef(null); // Reference to the audio element
  const [isPlaying, setIsPlaying] = useState(false); // Track play state

  const handlePlayPause = () => {
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
    <div className="now-playing">
      <div className="album-art-container" onClick={handlePlayPause}>
        <img src={Waves} alt="Track image" className="album-art" />
        <div className="play-button">
          <span>{isPlaying ? "⏸" : "▶"}</span>
        </div>
      </div>
      <div className="track-details">
        <p className="track-name">Crossing Field</p>
        <p className="artist-name">LiSA - Landscape</p>
      </div>
      <audio ref={audioRef} src={Song} />
    </div>
  );
};

export default NowPlaying;
