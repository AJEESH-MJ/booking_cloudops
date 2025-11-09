import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home.js';
import Main from './pages/Main.js';
import './index.css';

// single source of API base
export const API =
  process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

function App() {
  // token state is the source of truth for auth in memory;
  // localStorage is used for persistence across reloads
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // whenever token changes, update localStorage and decode minimal info
  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      localStorage.removeItem('token');
      return;
    }

    localStorage.setItem('token', token);

    // best-effort decode of JWT payload for UI (no validation here)
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        setCurrentUser({
          id: payload.sub,
          role: payload.role,
          email: payload.email ?? null,
        });
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, [token]);

  // call this when login succeeds (e.g. AuthForm will call onLogin(token))
  const handleLogin = newToken => {
    setToken(newToken);
    // after login we redirect to the protected app area
    navigate('/app', { replace: true });
  };

  // logout clears token and returns to home
  const handleLogout = () => {
    setToken('');
    setCurrentUser(null);
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  // simple auth check used inline in routes
  const isAuthenticated = Boolean(token || localStorage.getItem('token'));

  return (
    <Routes>
      <Route path="/" element={<Home onLogin={handleLogin} />} />

      {/* Inline protection: if not authenticated, redirect to / */}
      <Route
        path="/app/*"
        element={
          isAuthenticated ? (
            <Main
              token={token}
              onLogout={handleLogout}
              currentUser={currentUser}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* fallback */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/app' : '/'} replace />}
      />
    </Routes>
  );
}

export default App;
