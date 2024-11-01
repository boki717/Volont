// src/components/ProfilePage.js
import React, { useState } from 'react';
import  { useEffect }  from 'react';
import './OrgPage.css'; // Add styles as needed
import { Link } from 'react-router-dom';
import Post from '../../comps/Post';
import axios from 'axios';
import NotLoggedIn from "../../NotAllowed";
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

const OrgPage = () => {
  const token = localStorage.getItem("loginToken");
  const [thisUser, setThisUser] = useState({
    "_id": "x",
    "photo": null,
    "name": "x",
    "email": "x",
    "phone": "x",
    "city": "x",
    "description": "x"});
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const authStr = "Bearer ".concat(token);
      const resp1 = await api.get('/getloggedinuser', {headers: {Authorization: authStr}});
      setThisUser(resp1.data);
      const resp2 = await api.get(`/getUserPosts/${resp1.data._id}`);
      setUserPosts(resp2.data);
    } catch (err) {
      console.log("error trying to get user data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/editorg');
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserData();
    }
    fetchData();
  }, []);

  return (
    (token) ? (
    <div className="profile-page">
      <div className='slikaime'> 
      <img src={thisUser.photo ? `http://localhost:5000/${thisUser.photo}` : null} alt="Profile Picture" className='slika'/>
      </div>  
      <div className='telo' div>
      <label htmlFor="name" style={{ fontWeight: 'bold' }} label>
       Korisnicko ime
       </label>
       <div className='ime' div> 
      {thisUser.name }
      </div>
      <label htmlFor="name" style={{ fontWeight: 'bold' }} label>
        Status
      </label>  
      <div className='status' div>
      { thisUser.description }
      </div> 
      <label htmlFor="name" style={{ fontWeight: 'bold' }} label>
        Grad
      </label>
      <div className='grad'div>
      { thisUser.city }<label label>XXXX</label>
      </div>     
      <label htmlFor="name" style={{ fontWeight: 'bold' }} label>
        Email
      </label>   
      <div className='email' div>
      { thisUser.email }
      </div>
      <label htmlFor="name" style={{ fontWeight: 'bold' }} label>
        Broj telefona
      </label>
      <div className='broj'div>
        <label label>XXXXX</label>
      { thisUser.phone }
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit" className='dugmeedit' >edituj profil</button> 
      </form>
      </div>

      <h1>events:</h1>
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <div key={post._id} className="post-item">
            <Link to={`/orgpost/${post._id}`} className="post-link">
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
    </div>) : (<NotLoggedIn/>)
  );
};

export default OrgPage;
