import React, { useState } from 'react';
import axios from 'axios';

export default function AuthForm({ apiBase, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
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
        setMessage('Registration successful. Logging you in...');
        // auto-login after register
        const res = await axios.post(`${apiBase}/auth/login`, { email, password });
        const token = res.data.token;
        onLogin(token);
        setMessage('Logged in');
      } else {
        const res = await axios.post(`${apiBase}/auth/login`, { email, password });
        const token = res.data.token;
        onLogin(token);
        setMessage('Logged in');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || 'Auth failed';
      setMessage(errMsg);
    }
  };

  return (
    <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
      <h3>{mode === 'login' ? 'Login' : 'Register'}</h3>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {mode === 'register' && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
          <button type="button" onClick={toggle} style={{ background: '#eee' }}>
            {mode === 'login' ? 'Switch to Register' : 'Switch to Login'}
          </button>
        </div>
      </form>

      {message && <div style={{ marginTop: 8 }}>{message}</div>}
      <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
        This demo stores token in localStorage for persistence.
      </div>
    </div>
  );
}
