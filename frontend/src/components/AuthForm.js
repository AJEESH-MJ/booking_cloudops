import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';

export default function AuthForm({
  initialMode = 'login',
  onLogin,
  onLoginSubmit,
  onRegisterSubmit,
  loading = false,
  setTab,
}) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const busy = loading || localLoading;

  async function handleLoginSubmit(e) {
    e?.preventDefault?.();
    setMsg('');

    if (!email || !password) return setMsg('Please enter email and password');

    if (onLoginSubmit) {
      return onLoginSubmit({ email, password });
    }

    setLocalLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data?.token || res.data;
      const user = res.data?.user || null;
      if (!token) throw new Error('No token returned');
      if (onLogin) onLogin(token, user);
      setMsg('Logged in');
    } catch (err) {
      console.error('login', err);
      setMsg(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLocalLoading(false);
    }
  }

  async function handleRegisterSubmit(e) {
    e?.preventDefault?.();
    setMsg('');

    if (!name || !email || !password) return setMsg('Please fill all fields');
    if (password !== confirm) return setMsg('Passwords do not match');

    if (onRegisterSubmit) {
      return onRegisterSubmit({ name, email, password, confirm });
    }

    setLocalLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const token = res.data?.token || res.data;
      const user = res.data?.user || null;
      if (token && onLogin) {
        onLogin(token, user);
        setMsg('Registered and logged in');
      } else {
        setMsg('Account created — please login');
        setMode('login');
        setName('');
        setEmail('');
        setPassword('');
        setConfirm('');
        if (setTab) setTab('login');
      }
    } catch (err) {
      console.error('register', err);
      setMsg(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLocalLoading(false);
    }
  }
  
  const tabClass = (t) =>
    `px-4 py-2 rounded-md text-sm ${
      mode === t
        ? 'bg-white text-indigo-700 shadow'
        : 'bg-transparent text-gray-300 border border-transparent hover:bg-white/5'
    }`;

  return (
    <div className="relative">
      <div className="bg-[#0f1724] text-white rounded-2xl shadow-2xl p-8 max-w-md">
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => {
              setMode('login');
              if (setTab) setTab('login');
            }}
            className={tabClass('login')}
            disabled={busy}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('register');
              if (setTab) setTab('register');
            }}
            className={tabClass('register')}
            disabled={busy}
          >
            Register
          </button>
        </div>

        <h2 className="text-2xl font-extrabold text-center mb-4">
          Welcome Back <span className="inline-block">👋</span>
        </h2>

        <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit}>
          {mode === 'register' && (
            <div className="mb-3">
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0e1620] border border-gray-700 rounded px-3 py-2 placeholder-gray-400 focus:outline-none"
                placeholder="Your name"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0e1620] border border-gray-700 rounded px-3 py-2 placeholder-gray-400 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0e1620] border border-gray-700 rounded px-3 py-2 placeholder-gray-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {mode === 'register' && (
            <div className="mb-3">
              <label className="block text-sm text-gray-300 mb-1">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-[#0e1620] border border-gray-700 rounded px-3 py-2 placeholder-gray-400 focus:outline-none"
                placeholder="Repeat password"
              />
            </div>
          )}

          <div className="mt-4">
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-white text-indigo-700 py-3 rounded-lg font-semibold hover:shadow"
            >
              {busy ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </div>
        </form>

        {msg && <div className="mt-3 text-sm text-red-300">{msg}</div>}

        <div className="mt-6 text-center text-xs text-gray-400">
          By using this you agree to term and conditions. This is not a production app.
        </div>
      </div>
    </div>
  );
}
