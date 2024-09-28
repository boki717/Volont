import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Create this file for styling

const HomePage = () => {
  return (
    <div className="home-page">
      <img src="./logo.png" alt="logo" className="home-logo" />
      <div className="button-container">
        <Link to="/login" className="home-button">Login</Link>
        <Link to="/register" className="home-button">Register</Link>
      </div>
    </div>
  );
};

export default HomePage;
