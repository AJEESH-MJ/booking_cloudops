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
      <h3>My Bookings</h3>
      {!token && <div>Please login to view bookings.</div>}
      {list.map(b => (
        <div key={b._id} style={{ padding: 8, borderBottom: '1px solid #ddd' }}>
          <div><strong>{b.net?.name}</strong></div>
          <div>{new Date(b.startAt).toLocaleString()} - {new Date(b.endAt).toLocaleTimeString()}</div>
          <div>Status: {b.status}</div>
        </div>
      ))}
    </div>
  );
}
