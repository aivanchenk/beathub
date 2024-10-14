import React from "react";
import styles from "./styles.module.scss";

function Aside({ children }) {
  return <aside className={styles.info}>{children}</aside>;
}

export default Aside;
