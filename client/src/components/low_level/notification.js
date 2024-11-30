import React, { useState, useEffect } from "react";
import "./notification.scss";

const Notification = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`notification ${type}`}>
      <span className="message">{message}</span>
      <button className="close-button" onClick={onClose}>
        ✖
      </button>
    </div>
  );
};

export default Notification;
