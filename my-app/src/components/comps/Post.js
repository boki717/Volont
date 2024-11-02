// src/components/Post.js
import React from 'react';
import './Post.css'; // Add any styles you need

const Post = ({ title, date, location, photos, participants }) => {
  return (
    <div className="post">
      <div className="header">
        <h2>{title}</h2>
      </div>
      <div className="images">
        {photos.length > 0 ? (
          <img
            src={photos[0] ? `http://localhost:5000/${photos[0]}` : null}
            alt="First Photo"
          />
        ) : (
          <p>No photos available.</p>
        )}
      </div>
      <div className="footer">
        <div className='icons'>
          <div>📍</div>
          <div>📅</div>
          <div>👤</div>
        </div>
        <div className='info'>
            <div>{location}</div>
            <div>{new Date(date).toLocaleDateString()}</div>
            <div>Broj potrebnih volontera: {participants}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
