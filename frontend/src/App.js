import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home.js';
import Main from './pages/Main.js';
import AdminDashboard from './pages/AdminDashboard.js';
import './index.css';

// Single source of API base (adjust if needed)
export const API = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

function App() {
  const [token, setTokenState] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [restored, setRestored] = useState(false); // ensures routing waits for token restore
  const navigate = useNavigate();

  // --- Helper: persist token ---
  const setToken = (t) => {
    setTokenState(t || '');
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  };

  // --- Helper: decode JWT payload safely ---
  const decodeToken = (t) => {
    try {
      const parts = t.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        return {
          id: payload.id || payload.sub,
          role: payload.role,
          email: payload.email ?? null,
          name: payload.name ?? null,
        };
      }
    } catch {
      // ignore decoding errors
    }
    return null;
  };

  // --- Restore token and user on first load ---
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setTokenState(t);
      const decoded = decodeToken(t);
      if (decoded) setCurrentUser(decoded);
    }
    setRestored(true);
  }, []);

  // --- Handle Login ---
  const handleLogin = (newToken, user = null) => {
    setToken(newToken);
    const decodedUser = user || decodeToken(newToken);
    setCurrentUser(decodedUser);
    navigate(decodedUser?.role === 'admin' ? '/admin' : '/app', { replace: true });
  };

  // --- Handle Logout ---
  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    navigate('/', { replace: true });
  };

  // --- Derived states ---
  const isAuthenticated = Boolean(token);
  const isAdmin = currentUser?.role === 'admin';

  // --- Wait for restoration before rendering ---
  if (!restored) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  // --- Routing ---
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Home onLogin={handleLogin} />} />

      {/* Admin Route */}
      <Route
        path="/admin/*"
        element={
          isAuthenticated && isAdmin ? (
            <AdminDashboard token={token} currentUser={currentUser} />
          ) : (
            <Navigate to={isAuthenticated ? '/app' : '/'} replace />
          )
        }
      />

      {/* User Route */}
      <Route
        path="/app/*"
        element={
          isAuthenticated ? (
            <Main token={token} onLogout={handleLogout} currentUser={currentUser} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Fallback Route */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? isAdmin
                  ? '/admin'
                  : '/app'
                : '/'
            }
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
