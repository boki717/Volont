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
  const [photo, setPhoto] = useState(null);
  const [participants, setParticipants] = useState('');
  const navigate = useNavigate();
  const [ isOrg, setIsOrg ] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      title,
      date,
      description,
      photo: photo ? URL.createObjectURL(photo) : null,
      participants,
    };
    try {
      const authStr = "Bearer ".concat(token);
      const response = await api.post('/newpost', newPost, {headers: {Authorization: authStr}});
      console.log('New post response:', response.data);
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
            type="file" 
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])} 
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
