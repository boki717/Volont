import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const response = await api.post('/register', { name, email, password, confirmPassword });
        console.log('Registration response:', response.data);
        alert(response.data.msg);
        navigate('/login');
      } catch (err) {
        console.error('Registration error:', err);
        alert('Registration error');
      }
    } else {
      alert('Passwords do not match');
    }
  };
  
  

  return (
    <div className="register-page">
      <img src="./logo.png" alt="logo" className="register-logo" />
      <form onSubmit={handleSubmit} className="register-form">
      <input
          type="text"
          value={name}
          placeholder="ime i prezime"
          onChange={(e) => setName(e.target.value)}
          className="register-input"
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="register-input"
        />
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
