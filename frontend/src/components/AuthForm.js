import React, { useState } from 'react';
import axios from 'axios';

export default function AuthForm({ apiBase, onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const toggle = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setMessage('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (mode === 'register') {
        await axios.post(`${apiBase}/auth/register`, { name, email, password });
        const res = await axios.post(`${apiBase}/auth/login`, { email, password });
        const token = res.data.token;
        onLogin(token);
        setMessage('Registered and logged in');
      } else {
        const res = await axios.post(`${apiBase}/auth/login`, { email, password });
        const token = res.data.token;
        onLogin(token);
        setMessage('Logged in');
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Auth failed';
      setMessage(errMsg);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">{mode === 'login' ? 'Login' : 'Register'}</h3>
      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary"> {mode === 'login' ? 'Login' : 'Register'} </button>
          <button type="button" onClick={toggle} className="btn btn-ghost"> {mode === 'login' ? 'Switch to Register' : 'Switch to Login'} </button>
        </div>
      </form>

      {message && <div className="mt-3 text-sm text-red-600">{message}</div>}
    </div>
  );
}
