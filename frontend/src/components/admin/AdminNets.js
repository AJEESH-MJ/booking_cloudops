import React, { useEffect, useState } from 'react';
import api from '../../utils/api.js';

export default function AdminNets() {
  const [nets, setNets] = useState([]);
  const [form, setForm] = useState({ name:'', location:'', capacity:1 });

  useEffect(() => { load(); }, []);
  const load = () => api.get('/api/nets').then(r => setNets(r.data)).catch(console.error);

  async function createNet(e) {
    e.preventDefault();
    await api.post('/api/nets', form);
    setForm({ name:'', location:'', capacity:1 });
    load();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Manage Nets</h2>

      <form onSubmit={createNet} className="space-y-2 mb-4">
        <input className="border rounded px-3 py-2 w-full" placeholder="Name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
        <input className="border rounded px-3 py-2 w-full" placeholder="Location" value={form.location} onChange={e => setForm({...form, location:e.target.value})} />
        <input className="border rounded px-3 py-2 w-full" placeholder="Capacity" type="number" min="1" value={form.capacity} onChange={e => setForm({...form, capacity: Number(e.target.value)})} />
        <button className="btn btn-primary" type="submit">Create Net</button>
      </form>

      <div className="space-y-2">
        {nets.map(n => (
          <div key={n._id} className="p-3 border rounded flex justify-between">
            <div>
              <div className="font-medium">{n.name}</div>
              <div className="text-sm text-gray-500">{n.location}</div>
            </div>
            <div className="text-sm text-gray-500">{n.capacity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
