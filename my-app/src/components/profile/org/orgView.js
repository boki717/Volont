import React, { useState } from 'react';
import  { useEffect }  from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

const OrgView = () => {
  const { id } = useParams();
  const [thisUser, setThisUser] = useState({
    "_id": "x",
    "photo": null,
    "name": "x",
    "email": "x",
    "phone": "x",
    "city": "x",
    "description": "x"});

  const getUserData = async () => {
    try {
      const resp1 = await api.get(`/getuser/${id}`);
      setThisUser(resp1.data);
    } catch (err) {
      console.log("error trying to get user data");
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await getUserData();
    }
    fetchData();
  }, []);

  return (
    <>
      <img src={thisUser.photo ? `http://localhost:5000/${thisUser.photo}` : null} alt="Profile Picture"/>
      <p>{ thisUser.name }</p>
      <p>{ thisUser.description }</p>
      <p>{ thisUser.city }</p>
      <p>{ thisUser.email }</p>
      <p>{ thisUser.phone }</p>
    </>
  );
};

export default OrgView;
