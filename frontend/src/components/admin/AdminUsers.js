import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api.js';

function IconTrash(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18" />
      <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconSearch(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="6" />
      <path d="M21 21l-4.35-4.35" />
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
          <button onClick={onCancel} className="px-3 py-2 rounded border">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-2 rounded bg-red-600 text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get('/admin/users');
        if (!mounted) return;
        setUsers(res.data || []);
      } catch (err) {
        console.error('load users', err);
        alert('Failed to load users: ' + (err.response?.data?.error || err.message));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u => (u.name || u.email || '').toLowerCase().includes(term));
  }, [q, users]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages]);

  async function confirmDeleteUser() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${toDelete._id}`);
      setUsers(prev => prev.filter(u => u._id !== toDelete._id));
      setToDelete(null);
      alert('User deleted');
    } catch (err) {
      console.error('delete user', err);
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Users</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search by name or email"
              className="pl-10 pr-3 py-2 border rounded w-64 focus:outline-none focus:ring"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconSearch className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-sm text-gray-600">Name</th>
                <th className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-sm text-gray-600">Role</th>
                <th className="px-4 py-3 text-sm text-gray-600 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                // loading skeleton rows
                Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                    <td className="px-4 py-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded w-48" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    <td className="px-4 py-4 text-right"><div className="h-8 bg-gray-200 rounded w-20 inline-block" /></td>
                  </tr>
                ))
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                visible.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium">{u.name || '—'}</div>
                      <div className="text-xs text-gray-400 sm:hidden">{u.email}</div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell"><div className="text-sm text-gray-600">{u.email}</div></td>
                    <td className="px-4 py-4"><span className={`inline-block px-2 py-1 text-xs rounded ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setToDelete(u)}
                          title="Delete"
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

        {/* pagination */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <div className="px-3 py-1 border rounded bg-gray-50">{page}</div>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!toDelete}
        title="Delete user"
        description={`Delete user "${toDelete?.email || toDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDeleteUser}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );

  // helper extracted to keep JSX small
  function confirmDeleteUser() {
    // implemented above — placeholder only to satisfy linter if moved
  }
}
