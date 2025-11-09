import React from 'react';

export default function NetList({ nets, onSelect, selected }) {
  return (
    <div>
      <h2>Nets</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {nets.map(n => (
          <li key={n._id} style={{ margin: 8 }}>
            <button
              onClick={() => onSelect(n)}
              style={{
                padding: '8px 12px',
                background: selected && selected._id === n._id ? '#0366d6' : '#eee',
                color: selected && selected._id === n._id ? '#fff' : '#000',
                border: 'none',
                borderRadius: 4
              }}
            >
              {n.name} {n.location ? `(${n.location})` : ''}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
