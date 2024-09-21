import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Post from './Post';
import { usePosts } from '../PostContext';
import { useEffect } from 'react';
import './Feed.css';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});


const Feed = () => {
  const token = localStorage.getItem("loginToken");
  const { posts, addPost, removeAllPosts } = usePosts(); // Retrieve posts from context
  const [ isOrg, setIsOrg ] = useState(0);

  // get posts

  const loadPosts = async () => {
    try {
      try {
        const response = await api.get('/posts/1');  // OVDE DA SE MENJA OVAJ BROJ NA OSNOVU STRANICE FEED-A NA KOJOJ JE KORISNIK U TOM TRENUTKU --------------------------------
        console.log('Load feed response:', response.data.length);
        removeAllPosts();
        for (let i = 0; i < response.data.length; i++)
          await addPost(response.data[i]); // Assuming addPost returns a promise
      } catch (err) {
        console.error('Load feed error:', err);
        alert('Load feed error');
      }
    } catch (err) {
      alert('Error loading feed'); // Show an error message
    }
  };

  const orgCheck = async () => {
    try {
      const authStr = "Bearer ".concat(token);
      const response = await api.get('/admincheck', {headers: {Authorization: authStr}});
      setIsOrg(response.data.isOrg);
    } catch (err) {
      console.log("error trying to get response for org check");
    }
  };

  // use addPost to add them to the posts list
  // don't forget to remove addPost from PostForm.js

  useEffect(() => {
    const fetchData = async () => {
      await loadPosts();
      await orgCheck();
    }
    fetchData();
  }, []);


  return (
    <div className="feed">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="post-item">
            <Link to={`/post/${post._id}`} className="post-link">
              <Post
                title={post.title}
                date={post.date}
                description={post.description}
                photo={post.photo} // Ensure this is a URL or base64 string
                participants={post.participants}
              />
            </Link>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
      {isOrg === 1 ? (<Link to="/post-form" className="button">+</Link>) : <></>}
    </div>
  );
};

export default Feed;
