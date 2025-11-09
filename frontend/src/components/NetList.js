import React from 'react';

export default function NetList({ nets, onSelect, selected }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Nets</h2>
        <div className="text-sm text-gray-500">{nets.length} available</div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {nets.map(n => (
          <li key={n._id}>
            <button
              onClick={() => onSelect(n)}
              className={`w-full text-left p-3 rounded-md border hover:shadow-sm transition ${
                selected && selected._id === n._id ? 'bg-brand-500 text-white' : 'bg-white'
              }`}
            >
              <div className="font-medium">{n.name}</div>
              <div className="text-sm text-gray-500">{n.location || 'Main ground'}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
