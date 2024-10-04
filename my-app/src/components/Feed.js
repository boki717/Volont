import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { isOrgCheck } from './functions';
import Post from './comps/Post';
import './Feed.css';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});


const Feed = () => {
  const [ isOrg, setIsOrg ] = useState(0);
  const [ posts, setPosts ] = useState([]);

  // get posts
  const loadPosts = async () => {
    try {
      const response = await api.get('/posts/1');
      setPosts(response.data);
    } catch (err) {
      alert('Error loading feed'); // Show an error message
    }
  };

  // use addPost to add them to the posts list
  // don't forget to remove addPost from PostForm.js

  useEffect(() => {
    const fetchData = async () => {
      await loadPosts();
      await isOrgCheck(setIsOrg);
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
                photos={post.photos} // Ensure this is a URL or base64 string
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
