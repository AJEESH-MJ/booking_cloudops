import React, { useEffect, useState } from 'react';
import api from '../../utils/api.js';

export default function AdminBookings() {
  const [list, setList] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => { load(); }, []);

  async function load(q = {}) {
    const res = await api.get('/admin/bookings', { params: q });
    setList(res.data);
  }

  async function remove(id) {
    if (!window.confirm('Delete booking?')) return;
    await api.delete(`/admin/bookings/${id}`);
    load();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Bookings</h2>
      <div className="space-y-2">
        {list.map(b => (
          <div key={b._id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{b.net?.name} — {new Date(b.startAt).toLocaleString()}</div>
              <div className="text-sm text-gray-500">By: {b.user?.email || b.user?._id}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost" onClick={() => remove(b._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
