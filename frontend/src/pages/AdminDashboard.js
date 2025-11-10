import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminHome from '../components/admin/AdminHome.js';
import AdminUsers from '../components/admin/AdminUsers.js';
import AdminBookings from '../components/admin/AdminBookings.js';
import AdminSlots from '../components/admin/AdminSlots.js';
import AdminNets from '../components/admin/AdminNets.js';

function IconLogout(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 3H21V9" />
      <path d="M21 3L10 14" />
      <path d="M21 21H3V3" />
    </svg>
  );
}

export default function AdminDashboard({ currentUser, token, onLogout }) {
  const loc = useLocation();

  const tabs = [
    { to: '.', label: 'Home' },
    { to: 'users', label: 'Users' },
    { to: 'bookings', label: 'Bookings' },
    { to: 'nets', label: 'Nets' },
    { to: 'slots', label: 'Slots' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-indigo-600">Cricket Academy</div>
            <div className="text-sm text-gray-500">Admin dashboard</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">{currentUser?.email}</div>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white border text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <IconLogout className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>

          <nav className="flex gap-4 items-center text-sm">
            {tabs.map((t) => {
              const isActive =
                (t.to === '.' && loc.pathname.endsWith('/admin')) ||
                loc.pathname.endsWith(`/admin/${t.to}`) ||
                (t.to === '.' && loc.pathname === '/admin');
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="nets" element={<AdminNets />} />
            <Route path="slots" element={<AdminSlots />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
