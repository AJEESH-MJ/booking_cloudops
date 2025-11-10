import React, { useEffect, useState } from 'react';
import api from '../../utils/api.js';

export default function AdminSlots() {
  const [nets, setNets] = useState([]);
  const [form, setForm] = useState({ netId:'', date:'', startTime:'06:00', endTime:'07:00', intervalMinutes:30 });
  useEffect(() => { api.get('/nets').then(r => setNets(r.data)).catch(console.error); }, []);

  async function submit(e) {
    e.preventDefault();
    await api.post('/admin/slots', form);
    alert('Slots created');
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Create Slots</h2>

      <form onSubmit={submit} className="space-y-3 max-w-md">
        <select className="border rounded px-3 py-2 w-full" value={form.netId} onChange={e => setForm({...form, netId: e.target.value})} required>
          <option value="">Select net</option>
          {nets.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
        </select>

        <input className="border rounded px-3 py-2 w-full" type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})} required />

        <div className="flex gap-2">
          <input className="border rounded px-3 py-2 w-1/2" type="time" value={form.startTime} onChange={e => setForm({...form, startTime:e.target.value})} required />
          <input className="border rounded px-3 py-2 w-1/2" type="time" value={form.endTime} onChange={e => setForm({...form, endTime:e.target.value})} required />
        </div>

        <input className="border rounded px-3 py-2 w-full" type="number" value={form.intervalMinutes} onChange={e => setForm({...form, intervalMinutes: Number(e.target.value)})} min="5" />

        <button className="btn btn-primary" type="submit">Create</button>
      </form>
    </div>
  );
}
