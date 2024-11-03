import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isOrgCheck } from './functions';
import './AppBar.css'; // For styling

const AppBar = () => {
  const token = localStorage.getItem("loginToken");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Perform any necessary logout logic here (e.g., clearing auth tokens)
    localStorage.removeItem("loginToken");
    navigate('/home'); // Redirect to home page
  };

  const handleLogin = () => {
    navigate('/home'); // Redirect to home page
  };

  const handleHomeClick = () => {
    navigate('/feed'); // Redirect to Feed page
  };

  const handleProfilePageClick = () => {
    const fetchData = async () => {
      const isOrg = await isOrgCheck(() => {});
      if (isOrg === 1){
        navigate('/profileorg');
      }
      else{
        navigate('/profile'); // Redirect to Profile page
      }
    }
    fetchData();
  };

  return (
    <div className="app-bar">
      <div className="logo">
      <img src="./logo.png" alt="logo" onClick={handleHomeClick} className='logo1'/>
      </div>
      <div className="title">Volontiraj</div>
      <div className="profile" onClick={handleProfileClick}>
        <img src="./profile.png" alt="Profile" className="profile-icon" />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {token ? <button onClick={handleProfilePageClick} className="dropdown-button">Profile</button> : <></>}
            <button onClick={handleHomeClick} className="dropdown-button">Home</button>
            {token ? <button onClick={handleLogout} className="dropdown-button">Logout</button> :
            <button onClick={handleLogin} className="dropdown-button">Login</button>}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default AppBar;
