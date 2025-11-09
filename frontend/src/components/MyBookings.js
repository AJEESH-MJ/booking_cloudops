import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyBookings({ token, apiBase }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!token) return;
    axios.get(`${apiBase}/bookings/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setList(r.data)).catch(console.error);
  }, [token]);

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">My Bookings</h3>
      {!token && <div className="text-sm text-gray-500">Please login to view bookings.</div>}
      {list.length === 0 && token && <div className="text-sm text-gray-500">No bookings yet.</div>}
      <div className="space-y-3">
        {list.map(b => (
          <div key={b._id} className="border rounded p-3">
            <div className="font-medium">{b.net?.name}</div>
            <div className="text-sm text-gray-500">{new Date(b.startAt).toLocaleString()}</div>
            <div className="text-sm mt-1">Status: <span className="font-medium">{b.status}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}