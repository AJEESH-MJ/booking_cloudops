import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    }}>
      <div style={{ fontWeight: 'bold' }}>Cricket Academy</div>
      <div>
        {user ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 14 }}>{user.email ?? user.id}</div>
            <button onClick={onLogout} style={{ padding: '6px 10px' }}>Logout</button>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: '#666' }}>Not logged in</div>
        )}
      </div>
    </div>
  );
}
