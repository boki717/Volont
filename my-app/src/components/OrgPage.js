// src/components/ProfilePage.js
import React, { useState } from 'react';
import  { useEffect }  from 'react';
import './ProfilePage.css'; // Add styles as needed
import { Link } from 'react-router-dom';
import Post from './Post';
import axios from 'axios';
import NotLoggedIn from "./NotAllowed";
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

const ProfilePage = () => {
  const token = localStorage.getItem("loginToken");
  const [thisUser, setThisUser] = useState({
    "name": "x",
    "email": "x",
    "phone": "x",
    "city": "x",
    "description": "x"});
  const [userPosts, setUserPosts] = useState({});
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const authStr = "Bearer ".concat(token);
      const response = await api.get('/getuser', {headers: {Authorization: authStr}});
      setThisUser(response.data);
      console.log(response.data);
    } catch (err) {
      console.log("error trying to get user data");
    }
  };

  const getUserPosts = async () => {
    try{
      const authStr = "Bearer ".concat(token);
      const response = await api.get('/userPosts', {headers: {Authorization: authStr}});
      setUserPosts(response.data);
      console.log(response.data);
    }
    catch (err){
      console.log("error trying to get user events");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/editorg');
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserData();
      await getUserPosts();
    }
    fetchData();
  }, []);

  return (
    (token) ? (
    <div className="profile-page">
      <form onSubmit={handleSubmit}>
        <button type="submit">edituj profil</button>
      </form>
      <p>{ thisUser.name }</p>
      <p>{ thisUser.city }</p>
      <p>{ thisUser.description }</p>
      <p>{ thisUser.email }</p>
      <p>{ thisUser.phone }</p>
      <h1>events:</h1>
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <div key={post.id} className="post-item">
            <p>{`/orgpost/${post._id}`}</p>
            <Link to={`/orgpost/${post._id}`} className="post-link">
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
    </div>) : (<NotLoggedIn/>)
  );
};

export default ProfilePage;
