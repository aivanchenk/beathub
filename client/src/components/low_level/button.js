import React from "react";
import Arrow from "../../assests/icons/arrow-up-right.svg";
import "./button.scss";

const Button = ({ children, type = "primary", onClick }) => {
  return (
    <button className={`custom-button ${type}`} onClick={onClick}>
      {children}
      <img src={Arrow} alt="arrow" />
    </button>
  );
};

export default Button;
