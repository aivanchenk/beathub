import React from "react";
import "./right_sidebar.scss";

const RightSidebar = ({ isOpen, onClose, children }) => {
  return isOpen ? (
    <div className="right-sidebar">
      <button className="close-sidebar" onClick={onClose}>
        x
      </button>
      <div className="sidebar-content">{children}</div>
    </div>
  ) : null;
};

export default RightSidebar;
