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
  const navigate = useNavigate();
  const [ isOrg, setIsOrg ] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);
    formData.append("participants", participants);
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
      <h1>Add New Post</h1>
      <form onSubmit={handleSubmit}>
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
        <label>
          Participants Needed:
          <input 
            type="number" 
            value={participants} 
            onChange={(e) => setParticipants(e.target.value)} 
            required 
          />
        </label>
        <button type="submit">Add Post</button>
      </form>
    </div>
  ) : (<NotLoggedIn/>));
}

export default PostForm;
