import React, { useState } from 'react';
import axios from 'axios';

export default function BookingForm({ net, token, apiBase }) {
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState('');

  if (!net)
    return <div className="text-gray-300 text-sm">Select a net to book.</div>;

  const checkAvailability = async () => {
    try {
      const res = await axios.get(`${apiBase}/availability`, {
        params: { date, duration, netIds: net._id },
      });
      setOptions(res.data);
    } catch {
      setMessage('Error fetching availability');
    }
  };

  const book = async opt => {
    try {
      const formattedDate = new Date(date).toLocaleDateString('en-GB'); // converts to DD/MM/YYYY
      const finalDate = formattedDate.replaceAll('/', '-'); // converts to DD-MM-YYYY

      const payload = {
        netId: opt.net,
        date: finalDate,
        startAt: opt.startAt,
        endAt: opt.endAt,
        durationMinutes: duration,
      };

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(`${apiBase}/bookings`, payload, { headers });
      setMessage('✅ Booking confirmed!');
    } catch {
      setMessage('❌ Booking failed');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-gray-100 space-y-4 shadow-lg hover:shadow-cyan-500/20 transition">
      <h3 className="text-lg font-semibold text-cyan-300">Book {net.name}</h3>
      <div className="flex gap-3 items-center">
        <input
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-400"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <select
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        >
          <option value={30}>30 min</option>
          <option value={60}>60 min</option>
          <option value={90}>90 min</option>
        </select>
        <button
          onClick={checkAvailability}
          className="bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 rounded-lg text-sm text-white hover:scale-105 transition"
        >
          Check
        </button>
      </div>

      <div>
        {options.length === 0 ? (
          <div className="text-sm text-gray-400">
            No options yet. Choose date and click Check.
          </div>
        ) : (
          options.map((o, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/10 border border-white/20 rounded-lg p-3 mb-2"
            >
              <div>
                <div className="font-medium">
                  {new Date(o.startAt).toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">
                  {new Date(o.endAt).toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => book(o)}
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-1 rounded-lg text-sm"
              >
                Book
              </button>
            </div>
          ))
        )}
      </div>

      {message && <div className="text-sm text-cyan-300">{message}</div>}
    </div>
  );
}
