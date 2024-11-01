// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppBar from './components/AppBar';
import Feed from './components/Feed';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import PostDetailOrg from './components/profile/org/eventStatus';
import LoginPage from './components/logreg/LoginPage';
import RegisterPage from './components/logreg/RegisterPage';
import HomePage from './components/logreg/HomePage';
import OrgPage from './components/profile/org/OrgPage'; // Import ProfilePage
import EditOrgPage from './components/profile/org/EditOrgPage';
import './App.css';
import BottomBar from './components/BottomBar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/feed" element={<><AppBar /><Feed /><BottomBar/></>} />
        <Route path="/post-form" element={<PostForm />} />
        <Route path="/post/:id" element={<><AppBar /><PostDetail /></>} />
        <Route path="/orgpost/:id" element={<PostDetailOrg />}/>
        <Route path="/profile" element={<><AppBar /><OrgPage /></>} /> {/* Add route for ProfilePage */}
        <Route path="/editorg" element={<><AppBar /><EditOrgPage /></>} />
      </Routes>
    </Router>
  );
}

const ConditionalAppBar = () => {
  const location = useLocation();
  const shouldShowAppBar = location.pathname.startsWith('/feed') || location.pathname.startsWith('/post');

  return shouldShowAppBar ? <AppBar /> : null;
};

export default App;
