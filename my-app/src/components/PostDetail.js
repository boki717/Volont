import React from 'react';
import './PostDetails.css'; // Ensure this matches your file name
import NotLoggedIn from "./NotAllowed";

const PostDetail = () => {
  const token = localStorage.getItem("loginToken");
  
  if (!token){
    return(
      <NotLoggedIn/>
    );
  }

  return (
    <div className="post-detail">
      <p>Treba ovde da bude sve vezano za post</p>
      <p>Nzm sto se slike ne ucitavaju u app bar-u</p>
    </div>
    
  );
};

export default PostDetail;
