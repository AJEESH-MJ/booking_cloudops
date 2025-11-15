import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyBookings({ token, apiBase }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${apiBase}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(r => setList(r.data))
      .catch(console.error);
  }, [token]);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-gray-100 shadow-md hover:shadow-indigo-500/20 transition-all">
      <h3 className="text-xl font-semibold text-cyan-300 mb-3">My Bookings</h3>

      {!token ? (
        <p className="text-sm text-gray-400">Please login to view bookings.</p>
      ) : list.length === 0 ? (
        <p className="text-sm text-gray-400">No bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map(b => (
            <div
              key={b._id}
              className="bg-white/10 border border-white/20 rounded-xl p-4 hover:shadow-cyan-500/20 transition"
            >
              <div className="font-semibold text-white">{b.net?.name}</div>
              <div className="text-sm text-gray-300">
                {new Date(b.startAt).toLocaleString()}
              </div>
              <div className="text-sm mt-1">
                Status:{' '}
                <span className="font-medium text-cyan-300">{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
