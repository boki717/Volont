import React, { useState } from 'react';
import  { useEffect }  from 'react';
import { Link } from 'react-router-dom';
import Post from '../../comps/Post';
import axios from 'axios';
import NotLoggedIn from "../../NotAllowed";
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});
const messages = ["undefined", "na cekanju", "odbijen", "prihvacen", "ucestvovao"];

const VolunteerPage = () => {
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
    } catch (err) {
      console.log("error trying to get user data");
    }
  };

  const getUserEvents = async () => {
    try{
        const authStr = "Bearer ".concat(token);
        const response = await api.get('/getpostswithstatus', {headers: {Authorization: authStr}});
        setUserPosts(response.data);
        console.log(response.data);
    }
    catch (err){
        console.log(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/editprofile');
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserData();
      await getUserEvents();
    }
    fetchData();
  }, []);

  return (
    (token) ? (
    <div>
      <img src={thisUser.photo ? `http://localhost:5000/${thisUser.photo}` : null} alt="Profile Picture"/>
      <p>{ thisUser.name }</p>
      <p>{ thisUser.description }</p>
      <p>{ thisUser.city }</p>
      <p>{ thisUser.email }</p>
      <p>{ thisUser.phone }</p>

      <form onSubmit={handleSubmit}>
        <button type="submit">edituj profil</button> 
      </form>

      <h1>events:</h1>
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
            <>
            <Link to={`/post/${post._id}`}>
              <p>{post.title} | {messages[post.status]}</p>
            </Link>
            </>
        ))
    ) : (
      <p>Niste se jos prijavljivali za dogadjaje!</p>
    )}

    </div>) : (<NotLoggedIn/>)
  );
};

export default VolunteerPage;
