import React from "react";
import Link from "../low_level/link";
import "./footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h2 className="project-title">Student Project</h2>
          <p className="project-purpose">
            This project was created for educational purposes as part of the
            subject "Web Application Design".
          </p>
        </div>

        <div className="footer-middle">
          <h3 className="student-info-title">Created By</h3>
          <p className="student-info">Anastasiia Ivanchenko</p>
          <p className="subject">Subject: Web Application Design</p>
        </div>

        <div className="footer-right">
          <h3>Contact</h3>
          <ul className="social-links">
            <li>
              <Link href="mailto:a,ivanchenko.eu@gmail.com">Email</Link>
            </li>
            <li>
              <Link href="https://github.com/aivanchenk">GitHub</Link>
            </li>
            <li>
              <Link href="https://www.linkedin.com/in/anastasiia-ivanchenko-a797a2268/">
                LinkedIn
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Anastasiia Ivanchenko. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
