import React from "react";
import styles from "./styles.module.scss"; // Import your styles

function Card({ children }) {
  return <div className={styles.cardsContainer}>{children}</div>;
}

export default Card;
