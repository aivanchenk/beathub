import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth_context";
import Button from "../components/low_level/button";
import Notification from "../components/low_level/notification";
import "./login.scss";

const LoginModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [notification, setNotification] = useState(null); // For notifications
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      logIn(response.data.token);
      setNotification({
        type: "success",
        message: "Login successful!",
      });
      setFormData({ email: "", password: "" });

      // Delay closing modal and navigating
      setTimeout(() => {
        setNotification(null);
        onClose();
        navigate("/music-player");
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      if (error.response && error.response.data.msg) {
        setNotification({
          type: "error",
          message: error.response.data.msg,
        });
      } else {
        setNotification({
          type: "error",
          message: "An error occurred. Please try again.",
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-actions">
            <Button type="primary submit">Log In</Button>
          </div>
        </form>
      </div>
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

export default LoginModal;
