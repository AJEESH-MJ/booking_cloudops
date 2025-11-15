import React from 'react';
import { GiCricketBat } from 'react-icons/gi';

export default function VisualNets({ nets = [], selected, onSelect }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">
          <GiCricketBat className="text-indigo-400" /> Nets
        </h2>
        <span className="text-sm text-gray-300">{nets.length} available</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {nets.map(n => {
          const isSel = selected && selected._id === n._id;
          return (
            <button
              key={n._id}
              onClick={() => onSelect(n)}
              className={`p-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-200 shadow-lg hover:scale-[1.02] ${
                isSel
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-cyan-500/30'
                  : 'bg-white/10 text-gray-200 hover:shadow-indigo-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">{n.name}</div>
                  <div className="text-sm text-gray-300">
                    {n.location || 'Main ground'}
                  </div>
                </div>
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {n.capacity > 1 ? `${n.capacity} pax` : '1 pax'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
