import React, { useEffect, useState } from 'react';
import api from '../../utils/api.js';

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <h3 className="text-sm text-gray-500">Total bookings</h3>
        <div className="text-2xl">{stats?.totalBookings ?? '-'}</div>
      </div>
      <div className="card">
        <h3 className="text-sm text-gray-500">Bookings today</h3>
        <div className="text-2xl">{stats?.bookingsToday ?? '-'}</div>
      </div>
      <div className="card">
        <h3 className="text-sm text-gray-500">Active nets</h3>
        <div className="text-2xl">{stats?.activeNets ?? '-'}</div>
      </div>
    </div>
  );
}
