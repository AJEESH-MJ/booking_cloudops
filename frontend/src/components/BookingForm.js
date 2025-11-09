import React, { useState } from 'react';
import axios from 'axios';

export default function BookingForm({ net, token, apiBase }) {
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState('');

  if (!net) return <div><h3>Select a net to book</h3></div>;

  const checkAvailability = async () => {
    try {
      const res = await axios.get(`${apiBase}/availability`, {
        params: { date, duration, netIds: net._id }
      });
      setOptions(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Error fetching availability');
    }
  };

  const book = async (opt) => {
    try {
      const payload = {
        netId: opt.net,
        date,
        startAt: opt.startAt,
        endAt: opt.endAt,
        durationMinutes: duration
      };
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${apiBase}/bookings`, payload, { headers });
      setMessage('Booking confirmed: ' + res.data._id);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div>
      <h3>Book {net.name}</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
          <option value={30}>30 min</option>
          <option value={60}>60 min</option>
          <option value={90}>90 min</option>
        </select>
        <button onClick={checkAvailability}>Check</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Options</h4>
        {options.length === 0 && <div>No options. Choose date and click Check.</div>}
        <ul>
          {options.map((o, i) => (
            <li key={i} style={{ margin: 6 }}>
              <div>{new Date(o.startAt).toLocaleString()} - {new Date(o.endAt).toLocaleTimeString()}</div>
              <button onClick={() => book(o)}>Book this</button>
            </li>
          ))}
        </ul>
      </div>

      {message && <div style={{ marginTop: 12, color: 'green' }}>{message}</div>}
    </div>
  );
}
