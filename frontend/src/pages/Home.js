import React from 'react';
import AuthForm from '../components/AuthForm.js';

export default function Home({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-brand-500">
            Cricket Academy
          </h1>
          <p className="text-gray-600">
            Welcome — book nets quickly and securely. Create an account or login
            to start booking.
          </p>

          <ul className="list-disc ml-5 text-gray-700">
            <li>Easy slot booking</li>
            <li>Admin management</li>
            <li>Responsive UI — demo only</li>
          </ul>
        </div>

        <div className="card">
          <AuthForm
            apiBase={
              process.env.REACT_APP_API_BASE || 'http://localhost:8080/api'
            }
            onLogin={onLogin}
          />
        </div>
      </div>
    </div>
  );
}
