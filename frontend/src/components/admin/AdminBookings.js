import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api.js';

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

function ConfirmModal({ open, title, description, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-11/12 sm:w-2/5 p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-3 py-2 rounded border">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filterNet, setFilterNet] = useState('');
  const [filterDate, setFilterDate] = useState(''); // ✅ added missing state
  const [nets, setNets] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        api.get('/admin/bookings'),
        api.get('/nets'),
      ]);
      setBookings(r1.data || []);
      setNets(r2.data || []);
    } catch (err) {
      console.error('load', err);
      alert(
        'Failed to load bookings or nets: ' +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = bookings;
    if (term) {
      list = list.filter(b => {
        const text =
          `${b.user?.email || ''} ${b.net?.name || ''}`.toLowerCase();
        return text.includes(term);
      });
    }
    if (filterNet) {
      list = list.filter(b => (b.net?._id || b.net) === filterNet);
    }
    if (filterDate) {
      list = list.filter(
        b => new Date(b.startAt).toISOString().slice(0, 10) === filterDate
      );
    }
    return list.sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
  }, [bookings, q, filterNet, filterDate]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages]);

  async function handleDelete(id) {
    if (!window.confirm('Delete booking?')) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/bookings/${id}`);
      setBookings(prev => prev.filter(x => x._id !== id));
      alert('Booking deleted');
    } catch (err) {
      console.error('delete booking', err);
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Bookings</h2>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search by user or net"
            value={q}
            onChange={e => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded w-64 focus:outline-none focus:ring"
          />
          <select
            value={filterNet}
            onChange={e => {
              setFilterNet(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded"
          >
            <option value="">All nets</option>
            {nets.map(n => (
              <option key={n._id} value={n._id}>
                {n.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={e => {
              setFilterDate(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded"
          />
          <button
            onClick={() => {
              setQ('');
              setFilterNet('');
              setFilterDate('');
            }}
            className="px-3 py-2 border rounded"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-white border rounded shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-sm text-gray-600">When</th>
                <th className="px-4 py-3 text-sm text-gray-600">Net</th>
                <th className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                  User
                </th>
                <th className="px-4 py-3 text-sm text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-40" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="h-4 bg-gray-200 rounded w-48" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="h-8 bg-gray-200 rounded w-20 inline-block" />
                    </td>
                  </tr>
                ))
              ) : visible.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                visible.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium">
                        {new Date(b.startAt).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(b.endAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">{b.net?.name ?? 'Net'}</td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {b.user?.email ?? '—'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleDelete(b._id)}
                        disabled={deleting}
                        title="Delete booking"
                        className="p-2 rounded hover:bg-red-50 text-red-600"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>
            <div className="px-3 py-1 border rounded bg-gray-50">{page}</div>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!toDelete}
        title="Delete booking"
        description={`Delete selected booking? This action cannot be undone.`}
        onConfirm={() => {
          /* placeholder */
        }}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
