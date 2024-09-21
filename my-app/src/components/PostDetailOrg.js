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
  // const token = localStorage.getItem("loginToken");

  const getPost = async () => {
    try{
      console.log("requested");
      const response = await api.get(`getpost/${id}`);
      console.log("got responce");
      console.log(response.data);
      changePost(response.data);
      console.log("all good");
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
      <p>Accepted:</p>
      <p>Ovde ce da se ucitaju volonteri koji su prihvaceni da rade na akciji</p>
    </>
  );
};

export default PostDetailOrg;
