import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import  { useEffect }  from 'react';


const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,
  });


const PostDetailOrg = () => {
  const token = localStorage.getItem("loginToken");
  const { id } = useParams();
  const [currentPost, changePost] = useState({
    "title": "x",
    "description": "x",
     "date": null,
     "participants": 0,
     "datePosted": null
  });
  const [waiting, setWaiting] = useState([]);
  const [accepted, setAccepted] = useState([]);
  // const token = localStorage.getItem("loginToken");

  const getPost = async () => {
    try{
      // get post data
      console.log("requested");
      const response = await api.get(`getpost/${id}`);
      changePost(response.data);
      // get people who signed up
      const wait_response = await api.get(`geteventvolonters/?post_id=${id}&status=1`);
      setWaiting(wait_response.data);
      const accept_response = await api.get(`geteventvolonters/?post_id=${id}&status=3`);
      setAccepted(accept_response.data);
    }
    catch (err){
        console.log(err);
        console.log("failed to load this post");
    }
  }

  const changeStatus = async (new_st) => {
    // code for changeing status of userPost on backend and updating the page
    try{
      const authStr = "Bearer ".concat(token);
      const resp = await api.post("postuserchangestate", {post_id: id, new_status: new_st},
        {headers: {Authorization: authStr}});
    }
    catch (err){
      console.log(err);
    }
  }

  const acceptVolonter = async (e) => {
    e.preventDefault();
    changeStatus(3);
  };

  const rejectVolonter = async (e) => {
    e.preventDefault();
    changeStatus(2);
  };

  const rewardVolonter = async (e) => {
    e.preventDefault();
    changeStatus(4);
  };

  const waitVolonter = async (e) => {
    e.preventDefault();
    changeStatus(1);
  };


  useEffect(() => {
    const fetchData = async () => {
        await getPost();
    }
    fetchData();
  }, []);

  return (
    <>
      <p>{currentPost.title}</p>
      <p>{currentPost.description}</p>
      <p>{currentPost.date}</p>
      <p>{currentPost.datePosted}</p>
      <p>Prijavljeni:</p>

      {waiting.length > 0 ? (
        waiting.map((user) => (
          <>
          <p>{user.name}</p>
          <form onSubmit={acceptVolonter}>
            <button type="submit">Prihvati</button>
          </form>
          <form onSubmit={rejectVolonter}>
            <button type="submit">Odbi</button>
          </form>
          </>
          
        ))
      ) : (
        <p>Nema prijavljenih volontera.</p>
      )}

      <p>Prihvaceni:</p>
      {accepted.length > 0 ? (
        accepted.map((user) => (
          <>
          <p>{user.name}</p>
          <form onSubmit={rewardVolonter}>
            <button type="submit">Zavrsi</button>
          </form>
          <form onSubmit={waitVolonter}>
            <button type="submit">Skloni</button>
          </form>
          </>
        ))
      ) : (
        <p>Nema prihvacenih volontera.</p>
      )}
    </>
  );
};

export default PostDetailOrg;
