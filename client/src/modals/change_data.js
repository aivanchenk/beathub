import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Button from "../components/low_level/button";
import Notification from "../components/low_level/notification";

const ChangeDataModal = ({ isOpen, onClose }) => {
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/users/user-data",
        { newUsername, newEmail },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setNotification({
        type: "success",
        message: response.data.message,
      });

      setNewUsername("");
      setNewEmail("");

      // Wait for 2 seconds before closing the modal
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error updating user data:", error);
      setNotification({
        type: "error",
        message: "Failed to update user data. Please try again.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Change My Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newUsername">New Username</label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newEmail">New Email</label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
            />
          </div>
          <div className="modal-actions">
            <Button type="submit primary">Save Changes</Button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

ChangeDataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangeDataModal;
