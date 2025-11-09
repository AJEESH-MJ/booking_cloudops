import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Cricket Academy
          </Link>
          <span className="text-sm text-gray-500">Booking Demo</span>
        </div>

        {/* Right: User Info / Actions */}
        <div className="flex items-center gap-4">
          {/* Admin Link */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Admin
            </Link>
          )}

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">
                {user.email ?? user.id}
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-600">Not logged in</span>
          )}
        </div>
      </div>
    </nav>
  );
}
