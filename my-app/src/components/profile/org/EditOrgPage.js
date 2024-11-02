// src/components/ProfilePage.js
import React, { useState } from 'react';
import  { useEffect }  from 'react';
import './OrgPage.css'; // Add styles as needed
import axios from 'axios';
import NotLoggedIn from "../../NotAllowed";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

const ProfilePage = () => {
  const token = localStorage.getItem("loginToken");
  const [thisUser, setThisUser] = useState({
    "photo": null,
    "name": "x",
    "email": "x",
    "phone": "x",
    "city": "x",
    "description": "x"});

  const getUserData = async () => {
    try {
      const authStr = "Bearer ".concat(token);
      const response = await api.get('/getloggedinuser', {headers: {Authorization: authStr}});
      setThisUser(response.data);
    } catch (err) {
      console.log("error trying to get user data");
    }
  };

  const updateUser = async (param, val) => {
    setThisUser((prevUser) => ({...prevUser, [param]: val}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const formData = new FormData();
      for (const key in thisUser) {
        formData.append(key, thisUser[key]);
      }
      const authStr = "Bearer ".concat(token);
      const response = await api.put('/updateUser', formData, {headers: {Authorization: authStr}});
      console.log(response);
    }
    catch (err){
      console.log(err);
    }
    console.log("changes submitted");
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserData();
    }
    fetchData();
  }, []);

  return (
    (token) ? (
    <div className="profile-page">
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => updateUser("photo", e.target.files[0])}
        />
        <label>
          Ime i Prezime:
          <input 
            type="text" 
            value={thisUser.name}
            onChange={(e) => updateUser("name", e.target.value)}
            required
          />
        </label>
        <label>
          Grad:
          <input
            type="text" 
            value={thisUser.city} 
            onChange={(e) => updateUser("city", e.target.value)}
            required 
          />
        </label>
        <label>
          Description:
          <textarea 
            value={thisUser.description} 
            onChange={(e) => updateUser("description", e.target.value)} 
            required
          />
        </label>
        <label>
          email:
          <input 
            type="text" 
            value={thisUser.email} 
            onChange={(e) => updateUser("email", e.target.value)} 
            required
          />
        </label>
        <label>
          Telefon:
          <input 
            type="text" 
            value={thisUser.phone} 
            onChange={(e) => updateUser("phone", e.target.value)} 
            required
          />
        </label>
        <button type="submit">Sacuvaj promene</button>
      </form>
    </div>) : (<NotLoggedIn/>)
  );
};

export default ProfilePage;
