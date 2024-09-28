import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import  { useEffect }  from 'react';


const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,
  });


const PostDetailOrg = () => {
  const { id } = useParams();
  const [currentPost, changePost] = useState({
    "title": "x",
    "description": "x",
     "date": null,
     "participants": 0,
     "datePosted": null,
     "waiting": [],
     "accepted": []
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
      <p>Waiting:</p>
      <p>Ovde ce da se ucitaju volonteri koji su na cekanju</p>

      {waiting.length > 0 ? (
        waiting.map((user) => (
          <p>{user.name}</p>
        ))
      ) : (
        <p>No users available.</p>
      )}

      <p>Accepted:</p>
      <p>Ovde ce da se ucitaju volonteri koji su prihvaceni da rade na akciji</p>
      {accepted.length > 0 ? (
        accepted.map((user) => (
          <p>{user.name}</p>
        ))
      ) : (
        <p>No users available.</p>
      )}
    </>
  );
};

export default PostDetailOrg;
