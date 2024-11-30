import React, { useState } from "react";
import { useAuth } from "../../contexts/auth_context";
import { useNavigate } from "react-router-dom";
import CreatePlaylistModal from "../../modals/create_playlist";
import ChangeDataModal from "../../modals/change_data";
import AddSongModal from "../../modals/add_song";

import "./menu.scss";

const Menu = () => {
  const { userRole, userId, isLoggedIn } = useAuth();
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isChangeDataModalOpen, setChangeDataModalOpen] = useState(false);
  const [isAddSongModalOpen, setAddSongModalOpen] = useState(false);

  const handleLogOut = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <>
      <aside className="left-side-menu">
        <section className="menu-section">
          <h3 className="menu-title">Menu</h3>
          <ul className="menu-list">
            <li className="menu-item" onClick={() => setModalOpen(true)}>
              <span className="menu-icon">📖</span>
              Create playlist
            </li>
            <li className="menu-item">
              <span className="menu-icon">🔎</span>
              Search
            </li>
          </ul>
        </section>
        {userRole !== "listener" && (
          <section className="menu-section">
            <h3 className="menu-title">Additional</h3>
            <ul className="menu-list">
              <li
                className="menu-item"
                onClick={() => setAddSongModalOpen(true)}
              >
                <span className="menu-icon">🎧</span>
                Add a song
              </li>
              {userRole == "admin" && (
                <>
                  <li className="menu-item">
                    <span className="menu-icon">🎨</span>
                    Create an artist
                  </li>
                  <li className="menu-item">
                    <span className="menu-icon">📚</span>
                    Change user role
                  </li>
                  <li className="menu-item">
                    <span className="menu-icon">🔗</span>
                    Verify feedback
                  </li>
                </>
              )}
            </ul>
          </section>
        )}
        <section className="menu-section">
          <h3 className="menu-title">Others</h3>
          <ul className="menu-list">
            <li
              className="menu-item"
              onClick={() => setChangeDataModalOpen(true)}
            >
              <span className="menu-icon">👤</span>
              Change my data
            </li>
            <li className="menu-item" onClick={handleLogOut}>
              <span className="menu-icon">🚪</span>
              Logout
            </li>
          </ul>
        </section>
      </aside>

      {isLoggedIn && (
        <CreatePlaylistModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          userId={userId}
        />
      )}

      <ChangeDataModal
        isOpen={isChangeDataModalOpen}
        onClose={() => setChangeDataModalOpen(false)}
      />

      <AddSongModal
        isOpen={isAddSongModalOpen}
        onClose={() => setAddSongModalOpen(false)}
      />
    </>
  );
};

export default Menu;
