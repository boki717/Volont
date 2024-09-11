import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../PostContext';
import './PostForm.css';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

function PostForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [participants, setParticipants] = useState('');
  const navigate = useNavigate();
  const { addPost } = usePosts();

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
      // Ovde MOZDA moze da se doda čuvanje posta u bazu
      try {
        const response = await api.post('/newpost', newPost);
        console.log('New post response:', response.data);
        await addPost(newPost); // Assuming addPost returns a promise
        navigate('/feed');
      } catch (err) {
        console.error('New post error:', err);
        alert('New post error');
      }
    } catch (err) {
      alert('Error adding post'); // Show an error message
    }

    // Optionally reset the form
    setTitle('');
    setDate('');
    setDescription('');
    setPhoto(null);
    setParticipants('');
  };

  return (
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
  );
}

export default PostForm;
