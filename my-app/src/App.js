// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PostProvider } from './PostContext'; // Import your PostProvider
import AppBar from './components/AppBar';
import Feed from './components/Feed';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import PostDetailOrg from './components/PostDetailOrg';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import OrgPage from './components/OrgPage'; // Import ProfilePage
import EditOrgPage from './components/EditOrgPage';
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
          <Route path="/orgpost/:id" element={<PostDetailOrg />}/>
          <Route path="/profile" element={<><AppBar /><OrgPage /></>} /> {/* Add route for ProfilePage */}
          <Route path="/editorg" element={<><AppBar /><EditOrgPage /></>} />
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
