// frontend/src/pages/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import AuthForm from '../components/AuthForm.js';

function Toast({ text, onClose }) {
  if (!text) return null;
  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="bg-black/90 text-white px-4 py-2 rounded shadow-md flex items-center gap-3">
        <div className="text-sm">{text}</div>
        <button onClick={onClose} className="text-xs opacity-80 hover:opacity-100">
          Close
        </button>
      </div>
    </div>
  );
}

export default function Home({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const navigate = useNavigate();

  async function handleLogin(e) {
    e?.preventDefault?.();
    if (!loginForm.email || !loginForm.password) return setToast('Please enter email and password');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', loginForm);
      const token = res.data?.token || res.data;
      const user = res.data?.user || res.data?.userInfo || null;
      if (!token) return setToast('Login failed (no token returned)');
      onLogin(token, user);
      setToast('Login successful');
      navigate('/app', { replace: true });
    } catch (err) {
      console.error('login', err);
      setToast(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e?.preventDefault?.();
    if (!regForm.name || !regForm.email || !regForm.password) return setToast('Please fill all fields');
    if (regForm.password !== regForm.confirm) return setToast('Passwords do not match');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: regForm.name,
        email: regForm.email,
        password: regForm.password,
      });
      const token = res.data?.token || res.data;
      const user = res.data?.user || null;
      if (token) {
        onLogin(token, user);
        setToast('Account created');
      } else {
        setToast('Account created — you can now login');
        setTab('login');
        setRegForm({ name: '', email: '', password: '', confirm: '' });
      }
    } catch (err) {
      console.error('register', err);
      setToast(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left: Brand / Info Column */}
        <aside className="hidden lg:flex w-2/5 bg-gradient-to-br from-indigo-800 to-purple-600 text-white p-12 flex-col justify-center">
          <div className="max-w-md space-y-6">
            <div>
              <div className="text-2xl font-bold tracking-tight">
                Cricket<span className="text-purple-300">Academy</span>
              </div>
              <div className="text-sm text-indigo-200 mt-1">Admin & Booking Dashboard</div>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold leading-tight">Welcome back</h1>
              <p className="mt-3 text-indigo-100">
                Book nets, manage schedules, and run the academy — with a simple, elegant interface for staff and players.
              </p>
            </div>

            <div className="bg-white/8 p-5 rounded-lg">
              <div className="text-sm text-indigo-100 font-medium mb-2">Demo notes</div>
              <ul className="text-sm text-indigo-200 list-disc list-inside space-y-1">
                <li>Use the admin panel to create nets and slots.</li>
                <li>Users can book available slots from the main app.</li>
                <li>Tokens are stored in localStorage for demo persistence.</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Right: Auth area */}
        <main className="flex-1 flex items-center justify-center bg-white">
          <div className="w-full max-w-md px-6 py-10 relative">
            {/* AuthForm card sits here (the AuthForm component renders the dark card) */}
            <AuthForm
              initialMode={tab}
              onLogin={onLogin}
              onLoginSubmit={handleLogin}
              onRegisterSubmit={handleRegister}
              loading={loading}
              setTab={setTab}
            />
          </div>

          {/* Floating avatar / decorative element (optional) */}
          <div className="fixed right-8 bottom-8">
            <div className="w-14 h-14 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center shadow-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-yellow-300 flex items-center justify-center text-xs font-bold">
                😊
              </div>
            </div>
          </div>
        </main>
      </div>

      <Toast text={toast} onClose={() => setToast('')} />
    </div>
  );
}
