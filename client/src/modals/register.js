import React, { useState } from "react";
import axios from "axios";
import Button from "../components/low_level/button";
import Notification from "../components/low_level/notification";
import "./register.scss";

const RegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "listener",
  });

  const [notification, setNotification] = useState(null);

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
        "http://localhost:5000/api/auth/register",
        formData
      );
      setNotification({
        type: "success",
        message: "Registration successful!",
      });
      setFormData({ username: "", email: "", password: "", role: "listener" }); // Reset form
      setTimeout(() => {
        onClose();
        setNotification(null);
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data.msg) {
        setNotification({
          type: "error",
          message: error.response.data.msg,
        }); // Show error message from backend
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
    <div className="register-modal-overlay" onClick={onClose}>
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
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
            <Button type="primary submit">Register</Button>
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

export default RegisterModal;
