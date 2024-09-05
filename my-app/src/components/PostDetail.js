import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePosts } from '../PostContext';
import './PostDetails.css'; // Ensure this matches your file name

const PostDetail = () => {
  const { id } = useParams(); // Get the post id from the URL
  const { posts } = usePosts(); // Access posts from context
  const [imageUrl, setImageUrl] = useState('');

  // Find the post by id
  const post = posts.find(post => post.id === parseInt(id));

  useEffect(() => {
    if (post?.photo) {
      const url = URL.createObjectURL(post.photo);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup URL
    }
  }, [post]);

  if (!post) {
    return <p>Post not found.</p>;
  }

  const formattedDate = new Date(post.date).toLocaleDateString(); // Format the date

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Description:</strong> {post.description}</p>
      {imageUrl && (
        <img src={imageUrl} alt="Post" className="post-image" />
      )}
      <p><strong>Participants Needed:</strong> {post.participants}</p>
    </div>
  );
};

export default PostDetail;
