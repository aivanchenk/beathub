import React, { useState } from "react";
import { useAuth } from "../contexts/auth_context";
import Navbar from "../components/high_level/navbar";
import Menu from "../components/high_level/menu";
import TopArtists from "../components/high_level/top-artists";
import YourPlaylists from "../components/high_level/your-playlists";
import UserSongs from "../components/high_level/your-songs";
import RightSidebar from "../components/high_level/right_sidebar";

import PlaylistDetails from "../components/high_level/playlist_details";
import ArtistDetails from "../components/high_level/artist_details";
import SongDetails from "../components/high_level/song_details";

import "./music_player.scss";

function MusicPlayer() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarData, setSidebarData] = useState(null);
  const { userRole, userId } = useAuth();

  const handleCardClick = (data, type) => {
    console.log("Clicked ID:", data.id || data.playlist_id || data.artist_id);
    console.log(type);
    setSidebarData({ ...data, type });
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSidebarData(null);
  };

  return (
    <>
      <Navbar />
      <div className="page-content player">
        <Menu />
        <div className="player-page">
          <div className="legend"></div>
          <TopArtists onCardClick={handleCardClick} />
          <YourPlaylists onCardClick={handleCardClick} />
          {userRole == "author" && <UserSongs onCardClick={handleCardClick} />}
        </div>
        <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
          {sidebarData && (
            <div>
              {sidebarData.type === "playlist" && (
                <PlaylistDetails
                  id={sidebarData.playlist_id}
                  onSongClick={(song) => handleCardClick(song, "song")}
                />
              )}
              {sidebarData.type === "song" && (
                <SongDetails id={sidebarData.song_id} />
              )}
              {sidebarData.type === "artist" && (
                <ArtistDetails id={sidebarData.artist_id} />
              )}
            </div>
          )}
        </RightSidebar>
      </div>
    </>
  );
}

export default MusicPlayer;
