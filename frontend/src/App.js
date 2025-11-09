import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home.js';
import Main from './pages/Main.js';
import './index.css';

// keep API base in a single place for pages to use
export const API = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      localStorage.removeItem('token');
      return;
    }
    localStorage.setItem('token', token);
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        setCurrentUser({ id: payload.sub, role: payload.role, email: payload.email ?? null });
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, [token]);

  // on successful login: set token + navigate to main
  const handleLogin = (newToken) => {
    setToken(newToken);
    navigate('/app', { replace: true });
  };

  const handleLogout = () => {
    setToken('');
    setCurrentUser(null);
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  return (
    <Routes>
      <Route path="/" element={<Home onLogin={handleLogin} />} />
      <Route
        path="/app/*"
        element={<Main token={token} onLogout={handleLogout} currentUser={currentUser} />}
      />
      <Route path="*" element={<Home onLogin={handleLogin} />} />
    </Routes>
  );
}

export default App;
