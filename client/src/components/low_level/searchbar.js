import React, { useState } from "react";
import axios from "axios";
import PlaylistModal from "../../modals/playlist_select"; // Adjust path as needed
import "./searchbar.scss";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const handleSearch = async (e) => {
    const input = e.target.value;
    setQuery(input);

    if (!input) {
      setResults([]); // Clear results if query is empty
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/search", {
        params: { input },
      });
      setResults(response.data); // Update results with API response
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]); // Clear results on error
    }
  };

  const handleAddButtonClick = (songId) => {
    setSelectedSongId(songId);
    setPlaylistModalOpen(true); // Open the modal
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        value={query}
        onChange={handleSearch}
        placeholder="Search for songs, playlists, artists..."
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((result, index) => (
            <li key={index} className="search-result-item">
              <span className="result-type">{result.type}</span>
              <span className="result-title">{result.title}</span>
              <span className="result-likes">{result.likes_count} likes</span>
              {result.type === "song" && (
                <button
                  className="add-song-button"
                  onClick={() => handleAddButtonClick(result.id)}
                >
                  +
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {isPlaylistModalOpen && (
        <PlaylistModal
          songId={selectedSongId}
          onClose={() => setPlaylistModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
