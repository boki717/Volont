import React, { useState } from 'react';
import './PostDetails.css'; // Ensure this matches your file name
import  { useEffect }  from 'react';
import { useParams } from 'react-router-dom';
import { isOrgCheck } from './functions';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

const PostDetail = () => {
  const { id } = useParams();
  const [ isOrg, setIsOrg ] = useState(-1);
  const [ applied, setApplied ] = useState(0);
  const [postData, setPostData] = useState({
    "title": "title",
    "date": null,
    "datePosted": null,
    "description": "description",
    "photos": [],
    "participants": 0,
    "author": "",
    "authorId": null,
    "location": ""
  });
  const token = localStorage.getItem("loginToken");

  /*
  // Stuff for making postUser for testing
  const doStuff = async () => {
    try {
      const authStr = "Bearer ".concat(token);
      const response = await api.post(`/makepostuser/${id}`, {}, {headers: {Authorization: authStr}});
      console.log(response);
    } catch (err) {
      console.log("error trying to get user data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await doStuff();
    }
    fetchData();
  }, []);
  */

  const loadPost = async () => {
    try{
      const response = await api.get(`getpost/${id}`);
      setPostData(response.data);
    }
    catch (exp){
      console.log(exp);
    }
  }

  const isApplied = async () => {
    try{
      const authStr = "Bearer ".concat(token);
      const response = await api.get(`checkapplied/${id}`, {headers: {Authorization: authStr}});
      setApplied(response.data.applied);
    }
    catch (exp){
      console.log(exp);
    }
  }

  const participate = async (e) => {
    e.preventDefault();
    try {
      const authStr = "Bearer ".concat(token);
      const response = await api.post(`/makepostuser/${id}`, {}, {headers: {Authorization: authStr}});
      console.log(response);
    } catch (err) {
      console.log("error trying to apply to event");
    }
  }

  const giveUp = async (e) => {
    e.preventDefault();
    try {
      const authStr = "Bearer ".concat(token);
      const response = await api.delete(`/deletepostuser/${id}`, {headers: {Authorization: authStr}});
      console.log(response);
    } catch (err) {
      console.log("error trying to give up from event");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadPost();
      await isOrgCheck(setIsOrg);
      await isApplied();
    }
    fetchData();
  }, []);

  return (
    <>
    <p>{new Date(postData.datePosted).toLocaleDateString()}</p>
    <p>{postData.author}</p>
    <p>{postData.title}</p>
    <p>{postData.description}</p>
    <p>{new Date(postData.date).toLocaleDateString()}</p>
    <p>{postData.participants}</p>
    <p>{postData.location}</p>

    {postData.photos.length > 0 ? (
        postData.photos.map((photoName) => (
          <img src={photoName ? `http://localhost:5000/${photoName}` : null} alt="Photo"/>
        ))
      ) : (
        <p>Post nema slike.</p>
      )}
    {isOrg === 0 ? (applied === 0 ? (
      <form onSubmit={participate}>
        <button type="submit">Apliciraj!</button>
      </form>
      ) : <>
          <p>Prijavljeni ste!</p>
          <form onSubmit={giveUp}>
            <button type="submit">Odustani</button>
          </form>
          </>
    ) : <></>}
    </>
  );
};

export default PostDetail;
