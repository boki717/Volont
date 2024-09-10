// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PostProvider } from './PostContext'; // Import your PostProvider
import AppBar from './components/AppBar';
import Feed from './components/Feed';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage'; // Import ProfilePage
import './App.css';

function App() {
  return (
    <Router>
      <PostProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/feed" element={<><AppBar /><Feed /></>} />
          <Route path="/post-form" element={<PostForm />} />
          <Route path="/post/:id" element={<><AppBar /><PostDetail /></>} />
          <Route path="/profile" element={<><AppBar /><ProfilePage /></>} /> {/* Add route for ProfilePage */}
        </Routes>
      </PostProvider>
    </Router>
  );
}

const ConditionalAppBar = () => {
  const location = useLocation();
  const shouldShowAppBar = location.pathname.startsWith('/feed') || location.pathname.startsWith('/post');

  return shouldShowAppBar ? <AppBar /> : null;
};

export default App;
