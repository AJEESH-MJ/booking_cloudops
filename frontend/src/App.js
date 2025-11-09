import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NetList from './components/NetList.js';
import BookingForm from './components/BookingForm.js';
import MyBookings from './components/MyBookings.js';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

function App() {
  const [nets, setNets] = useState([]);
  const [selectedNet, setSelectedNet] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    axios.get(`${API}/nets`).then(r => setNets(r.data)).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Cricket Academy Booking (Demo)</h1>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <NetList nets={nets} onSelect={setSelectedNet} selected={selectedNet} />
          <BookingForm net={selectedNet} token={token} apiBase={API} />
        </div>
        <div style={{ width: 400 }}>
          <MyBookings token={token} apiBase={API} />
        </div>
      </div>
    </div>
  );
}

export default App;
