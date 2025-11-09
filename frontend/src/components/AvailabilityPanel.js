// frontend/src/components/AvailabilityPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../App.js';

/*
 AvailabilityPanel
 - selectedNet: net object
 - token (optional): not required for UI-only display
 - slotInterval: minutes (default 30)
 - businessStart/businessEnd: 'HH:mm' strings
*/
export default function AvailabilityPanel({
  selectedNet,
  slotInterval = 60,
  businessStart = '06:00',
  businessEnd = '22:00',
}) {
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [slots, setSlots] = useState([]); // generated timeline
  const [freeStarts, setFreeStarts] = useState([]); // start times (ISO) that are free (from API)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  // build timeline slots for the date
  useEffect(() => {
    const [sh, sm] = businessStart.split(':').map(Number);
    const [eh, em] = businessEnd.split(':').map(Number);
    const start = new Date(date + 'T00:00:00');
    start.setHours(sh, sm, 0, 0);
    const end = new Date(date + 'T00:00:00');
    end.setHours(eh, em, 0, 0);

    const t = [];
    let cur = new Date(start);
    while (cur < end) {
      const s = new Date(cur);
      const e = new Date(cur);
      e.setMinutes(e.getMinutes() + slotInterval);
      t.push({ start: new Date(s), end: new Date(e) });
      cur = new Date(e);
    }
    setSlots(t);
  }, [date, slotInterval, businessStart, businessEnd]);

  // fetch free slot start times from /api/availability for the chosen net and duration = slotInterval
  useEffect(() => {
    async function fetchFree() {
      if (!selectedNet) {
        setFreeStarts([]);
        return;
      }
      setLoading(true);
      setMessage('');
      try {
        // request availability for the date and duration = slotInterval
        const res = await axios.get(`${API}/availability`, {
          params: { date, duration: slotInterval, netIds: selectedNet._id }
        });
        // res.data is an array of options: { net, startAt, endAt }
        const starts = (res.data || []).map(o => {
          // normalize to ISO minute string
          return new Date(o.startAt).toISOString();
        });
        setFreeStarts(starts);
      } catch (err) {
        console.error('availability fetch error', err?.response?.data || err.message);
        setMessage('Unable to fetch availability. Showing offline view.');
        setFreeStarts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFree();
  }, [selectedNet, date, slotInterval]);

  const isFree = (slot) => {
    // mark free if slot.start ISO exists in freeStarts array (exact match)
    return freeStarts.includes(slot.start.toISOString());
  };

  const handleBookClick = (slot) => {
    // For now we only show a confirmation UI; booking logic can be wired later.
    setSelectedSlot(slot);
  };

  const confirmBooking = () => {
    // Placeholder demo: mark selected slot as "Booked" locally (visual only)
    if (selectedSlot) {
      const iso = selectedSlot.start.toISOString();
      // remove from freeStarts to simulate booking
      setFreeStarts(prev => prev.filter(s => s !== iso));
      setMessage(`Booked ${new Date(selectedSlot.start).toLocaleString()} — (demo only)`);
      setSelectedSlot(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Availability</h2>
        <div className="text-sm text-gray-500">{selectedNet ? selectedNet.name : 'Choose net'}</div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select value={slotInterval} onChange={(e) => { /* not editable for now */ }} className="hidden">
          <option value={30}>30</option>
        </select>
        <div className="ml-auto text-sm text-gray-600">
          <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2" /> free
          <span className="inline-block w-3 h-3 bg-red-300 rounded-full ml-4 mr-2 ml-4" /> unavailable
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {slots.map((slot, idx) => {
          const free = isFree(slot);
          return (
            <div key={idx} className={`p-3 rounded border flex items-center justify-between transition ${free ? 'bg-green-50 hover:scale-102' : 'bg-gray-50 opacity-80'}`}>
              <div>
                <div className="font-medium">{slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-sm text-gray-500">{slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div>
                {free ? (
                  <button onClick={() => handleBookClick(slot)} className="btn btn-primary">Book</button>
                ) : (
                  <div className="text-sm text-red-500">Booked</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loading && <div className="mt-3 text-sm text-gray-500">Loading availability...</div>}
      {message && <div className="mt-3 text-sm text-green-700">{message}</div>}

      {/* Simple confirm modal */}
      {selectedSlot && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setSelectedSlot(null)} />
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm booking</h3>
            <p className="text-sm text-gray-700 mb-4">
              Book {selectedNet?.name} on {new Date(selectedSlot.start).toLocaleDateString()} at {new Date(selectedSlot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}?
            </p>
            <div className="flex justify-end gap-2">
              <button className="btn btn-ghost" onClick={() => setSelectedSlot(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmBooking}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
