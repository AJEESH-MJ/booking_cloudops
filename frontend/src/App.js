import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NetList from './components/NetList.js';
import BookingForm from './components/BookingForm.js';
import MyBookings from './components/MyBookings.js';
import AuthForm from './components/AuthForm.js';
import Navbar from './components/Navbar.js';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

function App() {
  const [nets, setNets] = useState([]);
  const [selectedNet, setSelectedNet] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios.get(`${API}/nets`).then(r => setNets(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      localStorage.removeItem('token');
      return;
    }
    // store token persistently
    localStorage.setItem('token', token);
    // optionally decode token to extract user id / role (simple approach: ask backend)
    // We'll call a lightweight endpoint (if exists) or just set placeholder
    // For now, set user to a minimal object
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

  const onLogout = () => {
    setToken('');
    setCurrentUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen">
      <Navbar user={currentUser} onLogout={onLogout} />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Cricket Academy Booking (Demo)</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <NetList nets={nets} onSelect={setSelectedNet} selected={selectedNet} />
            </div>

            <div className="card">
              <BookingForm net={selectedNet} token={token} apiBase={API} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              {!token ? (
                <AuthForm apiBase={API} onLogin={(t) => setToken(t)} />
              ) : (
                <MyBookings token={token} apiBase={API} />
              )}
            </div>

            <div className="card">
              <h3 className="text-lg font-medium mb-2">How it works</h3>
              <p className="text-sm text-gray-600">
                Select a net, choose a date and duration, check availability and book. This demo stores token in localStorage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;