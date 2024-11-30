import React from "react";
import "./link.scss";

function Link({ children, href, onClick }) {
  return (
    <a href={href} className="link" onClick={onClick}>
      {children}
    </a>
  );
}

export default Link;
