import React from 'react';
import { Link } from 'react-router-dom';
import Post from './Post';
import { usePosts } from '../PostContext';
import { useEffect } from 'react';
import NotLoggedIn from "./NotAllowed";
import './Feed.css';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});


const Feed = () => {
  const token = localStorage.getItem("loginToken");
  const { posts, addPost, removeAllPosts } = usePosts(); // Retrieve posts from context

  // get posts

  const loadPosts = async () => {
    if (!token) return;
    try {
      // Ovde MOZDA moze da se doda čuvanje posta u bazu
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

  // use addPost to add them to the posts list
  // don't forget to remove addPost from PostForm.js

  useEffect(() => {
    loadPosts();
  }, []);  

  if (!token){
    return(
      <NotLoggedIn/>
    );
  }

  return (
    <div className="feed">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post-item">
            <Link to={`/post/${post.id}`} className="post-link">
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
      <Link to="/post-form" className="button">+</Link>
    </div>
  );
};

export default Feed;
