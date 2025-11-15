// frontend/src/components/admin/AdminHome.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api.js';

function StatCard({ title, value, hint }) {
  return (
    <div className="p-5 bg-white rounded-lg border">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {hint && <div className="mt-2 text-xs text-gray-400">{hint}</div>}
    </div>
  );
}

function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="bg-black/90 text-white px-4 py-2 rounded shadow-md">
        <div className="flex items-center gap-4">
          <div className="text-sm">{message}</div>
          <button onClick={onClose} className="text-xs opacity-80">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [nets, setNets] = useState([]);
  const [regenerating, setRegenerating] = useState(false);
  const [daysToRegenerate, setDaysToRegenerate] = useState(7);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoadingStats(true);
    try {
      const [s, b, n] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/bookings'),
        api.get('/nets'),
      ]);
      setStats(s.data || {});
      // show top 5 recent
      setRecentBookings((b.data || []).slice(0, 6));
      setNets(n.data || []);
    } catch (err) {
      console.error('load admin home', err);
      setToast('Failed to load admin home data');
    } finally {
      setLoadingStats(false);
    }
  }

  // bulk regenerate: for each net, call /admin/slots for next days (sequentially)
  async function regenerateForAllNets() {
    if (!nets.length) return setToast('No nets found');
    setRegenerating(true);
    const today = new Date();
    let totalCreated = 0;
    try {
      for (const net of nets) {
        for (let i = 0; i < daysToRegenerate; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          const dateStr = d.toISOString().slice(0, 10);
          // using default times from environment or fallback
          const startTime = process.env.REACT_APP_DEFAULT_START || '06:00';
          const endTime = process.env.REACT_APP_DEFAULT_END || '22:00';
          const interval = Number(process.env.REACT_APP_DEFAULT_INTERVAL || 30);
          const res = await api.post('/admin/slots', {
            netId: net._id,
            date: dateStr,
            startTime,
            endTime,
            intervalMinutes: interval,
          });
          totalCreated += res.data?.created?.length ?? 0;
        }
      }
      setToast(
        `Regenerated ${totalCreated} slots for ${daysToRegenerate} days across ${nets.length} nets`
      );
    } catch (err) {
      console.error('regenerate all', err);
      setToast(
        'Regenerate failed: ' + (err.response?.data?.error || err.message)
      );
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total bookings"
          value={loadingStats ? '—' : (stats?.totalBookings ?? 0)}
          hint="All-time bookings"
        />
        <StatCard
          title="Bookings today"
          value={loadingStats ? '—' : (stats?.bookingsToday ?? 0)}
          hint="Bookings made for today"
        />
        <StatCard
          title="Active nets"
          value={loadingStats ? '—' : (stats?.activeNets ?? 0)}
          hint="Nets currently enabled"
        />
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-medium mb-3">Quick actions</h3>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 mr-2">
              Regenerate next
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={daysToRegenerate}
              onChange={e => setDaysToRegenerate(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1"
            />
            <span className="text-sm text-gray-500 ml-2">
              days for all nets
            </span>
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={regenerateForAllNets}
              disabled={regenerating}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {regenerating ? 'Regenerating...' : 'Regenerate for all nets'}
            </button>
            <button onClick={loadAll} className="px-4 py-2 border rounded">
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-medium mb-3">Recent bookings</h3>
        {recentBookings.length === 0 ? (
          <div className="text-sm text-gray-500">No recent bookings</div>
        ) : (
          <div className="grid gap-2">
            {recentBookings.map(b => (
              <div
                key={b._id}
                className="p-3 border rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{b.net?.name ?? 'Net'}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(b.startAt).toLocaleString()} —{' '}
                    {b.user?.email ?? 'user'}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {b.booked ? 'Booked' : 'Reserved'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
