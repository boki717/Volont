import React from 'react';
import './PostDetails.css'; // Ensure this matches your file name
import  { useEffect }  from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

const PostDetail = () => {
  const { id } = useParams();
  const token = localStorage.getItem("loginToken");

  /*
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

  return (
    <div className="post-detail">
      <p>Treba ovde da bude sve vezano za post</p>
      <p>Nzm sto se slike ne ucitavaju u app bar-u</p>
    </div>
    
  );
};

export default PostDetail;
