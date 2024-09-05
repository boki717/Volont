// src/components/Post.js
import React from 'react';
import './Post.css'; // Add any styles you need

const Post = ({ title, date, description, photo, participants }) => {
  return (
    <div className="post">
      <h2>{title}</h2>
      <p>{new Date(date).toLocaleDateString()}</p>
      <p>{description}</p>
      {photo && <img src={photo} alt="Post" />}
      <p>Participants Needed: {participants}</p>
    </div>
  );
};

export default Post;
