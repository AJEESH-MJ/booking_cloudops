import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <div className="bg-white border-b">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-brand-500">Cricket Academy</div>
          <div className="text-sm text-gray-500">Booking demo</div>
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">{user.email ?? user.id}</div>
              <button onClick={onLogout} className="btn btn-ghost">Logout</button>
            </div>
          ) : (
            <div className="text-sm text-gray-600">Not logged in</div>
          )}
        </div>
      </div>
    </div>
  );
}
