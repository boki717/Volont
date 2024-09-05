import React, { createContext, useState, useContext } from 'react';

const PostContext = createContext({
  posts: [],
  addPost: () => {},
  removeAllPosts: () => {},
});

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const addPost = async (post) => {
    setPosts((prevPosts) => [...prevPosts, post]);
  };

  const removeAllPosts = () => {
    setPosts([]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, removeAllPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  return useContext(PostContext);
};