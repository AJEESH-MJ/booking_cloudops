// frontend/src/components/admin/AdminSlots.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api.js';

/* small Toast */
function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="bg-black/90 text-white px-4 py-2 rounded shadow-md flex items-center gap-4">
        <div className="text-sm">{message}</div>
        <button onClick={onClose} className="text-xs opacity-80">Close</button>
      </div>
    </div>
  );
}

/* small icons */
function IconClock() {
  return (
    <svg className="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg className="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18" />
      <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function AdminSlots() {
  const [nets, setNets] = useState([]);
  const [loadingNets, setLoadingNets] = useState(true);

  // form
  const [form, setForm] = useState({
    netId: '',
    date: '',
    startTime: '06:00',
    endTime: '07:00',
    intervalMinutes: 30,
  });

  // availability (existing slots for selected date & net)
  const [availSlots, setAvailSlots] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(false);

  // create state & toast
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState('');

  // confirm deletion
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoadingNets(true);
    api.get('/nets')
      .then(r => { if (mounted) setNets(r.data || []); })
      .catch(e => { console.error('load nets', e); setToast('Failed to load nets'); })
      .finally(() => { if (mounted) setLoadingNets(false); });
    return () => { mounted = false; };
  }, []);

  // load availability for selected net and date
  async function loadAvailability() {
    if (!form.netId || !form.date) {
      setAvailSlots([]);
      return;
    }
    setLoadingAvail(true);
    try {
      const res = await api.get('/availability', { params: { date: form.date, netIds: form.netId } });
      setAvailSlots(res.data || []);
    } catch (err) {
      console.error('load availability', err);
      setToast('Failed to load availability');
    } finally {
      setLoadingAvail(false);
    }
  }

  // create slots for single date
  async function handleCreateSlots(e) {
    e?.preventDefault?.();
    if (!form.netId) return setToast('Please select a net');
    if (!form.date) return setToast('Please pick a date');
    setCreating(true);
    try {
      const payload = {
        netId: form.netId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        intervalMinutes: form.intervalMinutes,
      };
      const res = await api.post('/admin/slots', payload);
      const created = res.data?.created?.length ?? 0;
      setToast(`Created ${created} slots`);
      // refresh availability
      await loadAvailability();
    } catch (err) {
      console.error('create slots', err);
      setToast(err.response?.data?.error || err.message || 'Failed to create slots');
    } finally {
      setCreating(false);
    }
  }

  // delete slot (backend may or may not support; show friendly message if not)
  async function handleDeleteSlot(slotId) {
    if (!slotId) return;
    // confirm via modal-like prompt (keeps UI simple)
    const ok = window.confirm('Delete this slot? This cannot be undone.');
    if (!ok) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/slots/${slotId}`);
      setToast('Slot deleted');
      setAvailSlots(prev => prev.filter(s => s._id !== slotId));
    } catch (err) {
      console.error('delete slot', err);
      if (err.response?.status === 404) {
        setToast('Delete endpoint not implemented on server');
      } else {
        setToast(err.response?.data?.error || err.message || 'Failed to delete slot');
      }
    } finally {
      setDeleting(false);
    }
  }

  // helper to pretty-format time ranges
  const formatTime = (startAt, endAt) => {
    try {
      const s = new Date(startAt);
      const e = new Date(endAt);
      return `${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return `${startAt} - ${endAt}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Slot Booking</h2>
          <div className="text-sm text-gray-500">Create and manage slots for a selected net and date.</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Selected Net:</div>
          <div className="font-medium">{nets.find(n => n._id === form.netId)?.name || '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleCreateSlots} className="bg-white border rounded p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Net</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.netId}
              onChange={(e) => setForm({ ...form, netId: e.target.value })}
              required
            >
              <option value="">Select net</option>
              {loadingNets ? <option>Loading...</option> : nets.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Interval (min)</label>
              <input
                type="number"
                min="5"
                className="w-full border rounded px-3 py-2"
                value={form.intervalMinutes}
                onChange={(e) => setForm({ ...form, intervalMinutes: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start time</label>
              <input
                type="time"
                className="w-full border rounded px-3 py-2"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">End time</label>
              <input
                type="time"
                className="w-full border rounded px-3 py-2"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <IconPlus /> {creating ? 'Creating...' : 'Create slots'}
            </button>

            <button
              type="button"
              onClick={loadAvailability}
              className="px-3 py-2 border rounded inline-flex items-center gap-2"
            >
              <IconClock /> Load existing
            </button>

            <div className="ml-auto text-sm text-gray-500">Creates slots by upsert — duplicates ignored.</div>
          </div>
        </form>

        {/* Availability list */}
        <div className="bg-white border rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Existing slots</h3>
            <div className="text-sm text-gray-500">{form.date || 'Pick a date'}</div>
          </div>

          <div className="max-h-96 overflow-auto space-y-2">
            {loadingAvail ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse p-3 bg-gray-50 rounded" />
              ))
            ) : availSlots.length === 0 ? (
              <div className="text-sm text-gray-500 p-3">No slots for the selected date.</div>
            ) : (
              availSlots.map(s => (
                <div key={s._id || (s.startAt + s.endAt)} className="p-3 bg-white rounded shadow-sm flex items-center justify-between border">
                  <div>
                    <div className="font-medium">{formatTime(s.startAt, s.endAt)}</div>
                    <div className="text-xs text-gray-400">{s.booked ? 'Booked' : 'Available'}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.booked && <div className="text-sm text-gray-500">—</div>}
                    {!s.booked && (
                      <button
                        onClick={() => handleDeleteSlot(s._id)}
                        disabled={deleting}
                        className="px-2 py-1 text-sm rounded border text-red-600 hover:bg-red-50"
                      >
                        <IconTrash />
                        <span className="ml-1">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
