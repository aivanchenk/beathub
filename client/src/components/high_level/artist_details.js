import React, { useEffect, useState } from "react";
import axios from "axios";

const ArtistDetails = ({ id }) => {
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/artists/${id}`
        );
        setArtist(response.data);
      } catch (error) {
        console.error("Error fetching artist details:", error);
      }
    };

    fetchArtist();
  }, [id]);

  if (!artist) return <p>Loading artist details...</p>;

  return (
    <div>
      <h3>{artist.name}</h3>
      <p>{artist.bio}</p>
      <p>Likes: {artist.likes_count}</p>
    </div>
  );
};

export default ArtistDetails;
