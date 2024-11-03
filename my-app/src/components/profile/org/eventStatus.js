import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NotLoggedIn from "../../NotAllowed";
import axios from 'axios';
import  { useEffect }  from 'react';
import { isOrgCheck } from '../../functions';


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
     "datePosted": null,
     "author": "x",
     "authorId": null,
     "location": "x"
  });
  const [waiting, setWaiting] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [ isOrg, setIsOrg ] = useState(0);
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

  const changeStatus = async (new_st, clicked_id) => {
    // code for changeing status of userPost on backend and updating the page
    try{
      const authStr = "Bearer ".concat(token);
      const resp = await api.post("/postuserchangestate", {post_id: id, user_id: clicked_id, new_status: new_st},
        {headers: {Authorization: authStr}});
      console.log(resp);
      window.location.reload();
    }
    catch (err){
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        await isOrgCheck(setIsOrg);
        await getPost();
    }
    fetchData();
  }, []);

  return (
    (isOrg === 1) ? (
    <>
      <p>{currentPost.title}</p>
      <p>{currentPost.description}</p>
      <p>{new Date(currentPost.date).toLocaleDateString()}</p>
      <p>{currentPost.location}</p>
      <p>{new Date(currentPost.datePosted).toLocaleDateString()}</p>
      <p>{currentPost.author}</p>
      <p>Prijavljeni:</p>

      {waiting.length > 0 ? (
        waiting.map((user) => (
          <>
          <Link to={`/volunteerview/${user._id}`}>
            <p>{user.name}</p>
          </Link>
          <form onSubmit={(e) => {e.preventDefault(); changeStatus(3, user._id);}}>
            <button type="submit">Prihvati</button>
          </form>
          <form onSubmit={(e) => {e.preventDefault(); changeStatus(2, user._id);}}>
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
          <Link to={`/volunteerview/${user._id}`}>
            <p>{user.name}</p>
          </Link>
          <form onSubmit={(e) => {e.preventDefault(); changeStatus(4, user._id);}}>
            <button type="submit">Zavrsi</button>
          </form>
          <form onSubmit={(e) => {e.preventDefault(); changeStatus(1, user._id);}}>
            <button type="submit">Skloni</button>
          </form>
          </>
        ))
      ) : (
        <p>Nema prihvacenih volontera.</p>
      )}
    </>
  ) : (<NotLoggedIn/>));
};

export default PostDetailOrg;
