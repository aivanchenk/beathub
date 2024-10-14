import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Aside from "../components/Wrappers/aside";
import Card from "../components/Wrappers/card";

import styles from "./styles.module.scss";

function ListenerPage() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchSongsAndPlaylists = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/1/collections"
        );
        setSongs(response.data.songs);
        setPlaylists(response.data.playlists);
      } catch (error) {
        console.error("Error fetching songs and playlists:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/1");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching songs and playlists:", error);
      }
    };

    fetchUserData();
    fetchSongsAndPlaylists();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  return (
    <div className={styles.page}>
      <Aside>
        <h1>Hello {userData ? userData.name : "User"}</h1>
        {userData && (
          <div>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Joined:</strong> {formatDate(userData.created_at)}
            </p>
            <p>
              You have: <br />
              <strong>{songs.length} songs </strong> <br />
              <strong> {playlists.length} playlists</strong>
            </p>
          </div>
        )}
      </Aside>
      <main>
        <section>
          <h1>Your Playlists:</h1>
          <Card>
            {playlists.map((playlist) => (
              <Link
                to={`/playlists/${playlist.playlist_id}`}
                key={playlist.playlist_id}
                className={`${styles.card} ${styles.el3}`}
              >
                <div className={styles.headerRow}>
                  <h2>{playlist.name}</h2>
                  <p>Songs: {playlist.song_count}</p>
                </div>
                <p>{playlist.description}</p>
              </Link>
            ))}
          </Card>
        </section>
      </main>
    </div>
  );
}

export default ListenerPage;
