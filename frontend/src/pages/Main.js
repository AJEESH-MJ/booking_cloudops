import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.js';
import NetList from '../components/NetList.js';
import BookingForm from '../components/BookingForm.js';
import MyBookings from '../components/MyBookings.js';
import { API } from '../App.js';

export default function Main({ token, onLogout, currentUser }) {
  const [nets, setNets] = useState([]);
  const [selectedNet, setSelectedNet] = useState(null);

  useEffect(() => {
    axios.get(`${API}/nets`).then(r => setNets(r.data)).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={currentUser} onLogout={onLogout} />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Booking Dashboard</h1>

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
              <MyBookings token={token} apiBase={API} />
            </div>
            <div className="card">
              <h3 className="text-lg font-medium mb-2">Quick Help</h3>
              <p className="text-sm text-gray-600">Select a net, pick a date, check availability and book.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
