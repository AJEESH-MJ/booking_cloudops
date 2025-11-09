// frontend/src/pages/AdminDashboard.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AdminHome from '../components/admin/AdminHome.js';
import AdminUsers from '../components/admin/AdminUsers.js';
import AdminBookings from '../components/admin/AdminBookings.js';
import AdminSlots from '../components/admin/AdminSlots.js';
import AdminNets from '../components/admin/AdminNets.js';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <nav className="space-x-3">
            <Link to="." className="text-sm text-gray-600">Home</Link>
            <Link to="users" className="text-sm text-gray-600">Users</Link>
            <Link to="bookings" className="text-sm text-gray-600">Bookings</Link>
            <Link to="nets" className="text-sm text-gray-600">Nets</Link>
            <Link to="slots" className="text-sm text-gray-600">Slots</Link>
          </nav>
        </div>

        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="nets" element={<AdminNets />} />
          <Route path="slots" element={<AdminSlots />} />
        </Routes>
      </div>
    </div>
  );
}
