import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminHome from '../components/admin/AdminHome.js';
import AdminUsers from '../components/admin/AdminUsers.js';
import AdminBookings from '../components/admin/AdminBookings.js';
import AdminSlots from '../components/admin/AdminSlots.js';
import AdminNets from '../components/admin/AdminNets.js';
import { LogOut as IconLogout, User, Home, Users, CalendarDays, Network, Clock } from "lucide-react";

export default function AdminDashboard({ currentUser, token, onLogout }) {
  const loc = useLocation();

  const tabs = [
    { to: '.', label: 'Home', icon: Home },
    { to: 'users', label: 'Users', icon: Users },
    { to: 'bookings', label: 'Bookings', icon: CalendarDays },
    { to: 'nets', label: 'Nets', icon: Network },
    { to: 'slots', label: 'Slots', icon: Clock }
  ];

  const displayName = currentUser?.email
    ? currentUser.email.split('@')[0].replace(/^\w/, c => c.toUpperCase())
    : 'Admin';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col shadow-lg">
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="text-2xl font-bold tracking-tight">
            Cricket<span className="text-indigo-300">Academy</span>
          </div>
          <div className="text-sm text-indigo-100 opacity-80 mt-1">Admin Panel</div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {tabs.map((t) => {
            const isActive =
              (t.to === '.' && loc.pathname.endsWith('/admin')) ||
              loc.pathname.endsWith(`/admin/${t.to}`) ||
              (t.to === '.' && loc.pathname === '/admin');
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-center gap-3 mb-3">
            <User className="w-5 h-5 text-indigo-300" />
            <span className="text-sm text-white/90">{displayName}</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-all duration-150"
          >
            <IconLogout className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 bg-white border-b px-6 py-4 shadow-sm flex justify-between items-center z-10">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
        </header>

        <section className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Routes>
              <Route index element={<AdminHome />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="nets" element={<AdminNets />} />
              <Route path="slots" element={<AdminSlots />} />
            </Routes>
          </div>
        </section>
      </main>
    </div>
  );
}
