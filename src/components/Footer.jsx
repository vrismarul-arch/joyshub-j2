import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram, FaYoutube,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Logo + About */}
        <div className="footer-section">
          <img src="/logo.png" alt="ZenZones Props Logo" className="footer-logo" />
          
        </div>

        {/* Column 2: Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li>
            
              No-1, Ramamoorthy Avenue, 2nd Main Road, Kolapakkam, Chennai - 600116
            </li>
           

          </ul>
        </div>

        {/* Column 3: Socials */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="footer-socials">
            <a
              href="https://www.facebook.com/profile.php?id=61576938355118"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/zenovastays/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href="https://youtube.com/@zenovastays?si=g6RJfh8bMFDpBiNK"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>


          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} zenovastays. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
