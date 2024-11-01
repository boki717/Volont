import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomBar.css'; // For styling
const BottomBar = () => {
    return (
        <footer className="footer-page">
          <div className="footer-container">
            <div className="footer-section">
              <h4>Contact Us</h4>
              <div>Email: volontirajorg@gmail.com</div>
              <div>Phone: +381 61 1706546</div>
              <div>Address: Viline Vode 6, Beograd, Srbija</div>
            </div>
            <div className="footer-section">
                <h4>Follow Us</h4>
                <div><a href="https://facebook.com">Facebook</a></div>
                <div><a href="https://twitter.com">Twitter</a></div>
                <div><a href="https://www.instagram.com/volontirajorg/">Instagram</a></div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <div><a href="/about">About Us</a></div>
              <div><a href="/services">Services</a></div>
              <div><a href="/contact">Contact</a></div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Ramostvo. All rights reserved.</p>
          </div>
        </footer>
      );
    };
  export default BottomBar;