// src/components/Post.js
import React from 'react';
import './Post.css'; // Add any styles you need

const Post = ({ title, date, description, photos, participants }) => {
  return (
    <div className="post">
      <h2>{title}</h2>
      <p>{new Date(date).toLocaleDateString()}</p>
      <p>{description}</p>
      {photos.length > 0 ? (
        photos.map((photo) => (
          <img src={photo ? `http://localhost:5000/${photo}` : null} alt="Photo"/>
        ))
      ) : (
        <p>No photos available.</p>
      )}
      <p>Participants Needed: {participants}</p>
    </div>
  );
};

export default Post;
