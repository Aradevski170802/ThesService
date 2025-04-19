// frontend/src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // 1) call the API
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );

      // 2) destructure token + user info
      const { token, user: userInfo } = data;

      // 3) save into context / localStorage
      login({ ...userInfo, token });

      // 4) redirect based on role
      if (userInfo.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/reports');
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err);
      alert(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="container login-container">
      <div className="form-wrapper">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
