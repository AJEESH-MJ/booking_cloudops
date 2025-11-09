// frontend/src/pages/Main.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.js';
import VisualNets from '../components/VisualNets.js';
import AvailabilityPanel from '../components/AvailabilityPanel.js';
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
          <div className="md:col-span-1">
            <div className="card">
              <VisualNets nets={nets} selected={selectedNet} onSelect={setSelectedNet} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <AvailabilityPanel selectedNet={selectedNet} />
            </div>

            <div className="card">
              <h3 className="text-lg font-medium mb-2">Quick Help</h3>
              <p className="text-sm text-gray-600">Select a net on the left, choose a date on the right, see free slots (green) and booked slots (red). Click a free slot to demo-book it locally.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
