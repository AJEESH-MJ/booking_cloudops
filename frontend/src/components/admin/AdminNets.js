// frontend/src/components/admin/AdminNets.js
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api.js';

/* small icons */
function IconPlus(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconTrash(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 6h18" />
      <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

/* Confirm modal */
function ConfirmModal({ open, title, description, busy, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="px-3 py-2 rounded border"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="px-3 py-2 rounded bg-red-600 text-white"
          >
            {busy ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Toast */
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

export default function AdminNets() {
  const [nets, setNets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    capacity: 1,
    autoGenerate: true,
  });
  const [creating, setCreating] = useState(false);

  // delete
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // toast
  const [toast, setToast] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/nets');
      setNets(r.data || []);
    } catch (e) {
      console.error('load nets', e);
      setToast('Failed to load nets');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return nets;
    return nets.filter(
      n =>
        (n.name || '').toLowerCase().includes(term) ||
        (n.location || '').toLowerCase().includes(term)
    );
  }, [q, nets]);

  async function handleCreate(e) {
    e && e.preventDefault();
    setCreating(true);
    try {
      const payload = { ...form };
      const res = await api.post('/nets', payload);
      setToast(`Net "${res.data.name}" created`);
      setForm({ name: '', location: '', capacity: 1, autoGenerate: true });
      setFormOpen(false);
      load();
    } catch (err) {
      console.error('create net', err);
      setToast(err.response?.data?.error || err.message || 'Create failed');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/nets/${toDelete._id}`);
      setToast('Net deleted');
      setNets(prev =>
        prev.filter(x => x._id !== toDelete._1d && x._id !== toDelete._id)
      );
      setToDelete(null);
      load();
    } catch (err) {
      console.error('delete net', err);
      setToast('Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Nets</h2>
        <div className="flex items-center gap-3">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search nets"
            className="px-3 py-2 border rounded"
          />
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            <IconPlus className="w-4 h-4" /> Create Net
          </button>
        </div>
      </div>

      <div className="bg-white border rounded shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-sm text-gray-600">Name</th>
                <th className="px-4 py-3 text-sm text-gray-600">Location</th>
                <th className="px-4 py-3 text-sm text-gray-600">Capacity</th>
                <th className="px-4 py-3 text-sm text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-40" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-12" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="h-8 bg-gray-200 rounded w-20 inline-block" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No nets found.
                  </td>
                </tr>
              ) : (
                filtered.map(n => (
                  <tr key={n._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">{n.name}</td>
                    <td className="px-4 py-4">{n.location || '—'}</td>
                    <td className="px-4 py-4">{n.capacity ?? 1}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          title="Delete"
                          onClick={() => setToDelete(n)}
                          className="p-2 rounded hover:bg-red-50 text-red-600"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* create form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg w-full max-w-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">Create Net</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Location</label>
                <input
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={e =>
                    setForm({ ...form, capacity: Number(e.target.value) })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.autoGenerate}
                    onChange={e =>
                      setForm({ ...form, autoGenerate: e.target.checked })
                    }
                  />
                  Auto-generate slots
                </label>
                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-3 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-3 py-2 bg-indigo-600 text-white rounded"
                  >
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete net"
        description={`Delete net "${toDelete?.name}"? This will remove associated slots and cannot be undone.`}
        busy={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
