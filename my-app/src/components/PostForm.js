import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { isOrgCheck } from './functions';
import './PostForm.css';
import NotLoggedIn from "./NotAllowed";
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

function PostForm() {
  const token = localStorage.getItem("loginToken");
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState(null);
  const [participants, setParticipants] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const [ isOrg, setIsOrg ] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);
    formData.append("participants", participants);
    formData.append("location", location);
    // const pictureFiles = e.target.files;
    for (let i = 0; i < photos.length; i++){
      formData.append("photos", photos[i]);
    }
    try {
      const authStr = "Bearer ".concat(token);
      const response = await api.post('/newpost', formData, {headers: {Authorization: authStr}});
      navigate('/feed');
    } catch (err) {
      console.error('New post error:', err);
      alert('New post error');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await isOrgCheck(setIsOrg);
    }
    fetchData();
  }, []);

  return (
    (isOrg === 1) ? (
    <div className="post-form">
      <div className='logoitekst'>
      <h1>Add New Post</h1>
      <img src='./logo.png' alt="Logo" className="logo" /> {/* Dodaj logo ovde */}
      </div>
      <form onSubmit={handleSubmit}>
        <div className='header'>
        <label>
          Title:
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </label>
        <label>
          Date:
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </label>
        <label className='participansinput'>
          Participants Needed:
          <input 
            type="number" 
            value={participants} 
            onChange={(e) => setParticipants(e.target.value)} 
            required 
          />
        </label>
        </div>
        <label>
          Description:
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </label>
        <label>
          Add a Photo:
          <input
            type="file" multiple
            accept="image/*"
            onChange={(e) => setPhotos(e.target.files)} 
          />
        </label>
        <label style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '16px', color: '#333' }}>
          Location:
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </label>
        <button type="submit">Add Post</button>
      </form>
    </div>
  ) : (<NotLoggedIn/>));
}

export default PostForm;
