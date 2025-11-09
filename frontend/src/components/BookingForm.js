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
      <h3 className="text-lg font-medium mb-3">Book {net.name}</h3>

      <div className="flex gap-2 items-center">
        <input className="border rounded px-3 py-2" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <select className="border rounded px-3 py-2" value={duration} onChange={e => setDuration(Number(e.target.value))}>
          <option value={30}>30 min</option>
          <option value={60}>60 min</option>
          <option value={90}>90 min</option>
        </select>
        <button onClick={checkAvailability} className="btn btn-primary">Check</button>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Options</h4>
        {options.length === 0 && <div className="text-sm text-gray-500">No options. Choose date and click Check.</div>}
        <div className="space-y-2">
          {options.map((o, i) => (
            <div key={i} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">{new Date(o.startAt).toLocaleString()}</div>
                <div className="text-sm text-gray-500">{new Date(o.endAt).toLocaleTimeString()}</div>
              </div>
              <button onClick={() => book(o)} className="btn btn-primary">Book</button>
            </div>
          ))}
        </div>
      </div>

      {message && <div className="mt-3 text-sm text-gray-700">{message}</div>}
    </div>
  );
}