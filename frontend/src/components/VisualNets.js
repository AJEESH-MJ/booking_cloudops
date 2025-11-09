// frontend/src/components/VisualNets.js
import React from 'react';
import { GiCricketBat } from 'react-icons/gi';

/**
 * VisualNets
 * - nets: array of net objects
 * - selected: currently selected net object
 * - onSelect: function(net)
 *
 * Renders nets in a simple grid that resembles nets laid out on a ground.
 */
export default function VisualNets({ nets = [], selected, onSelect }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold flex items-center gap-2"><GiCricketBat /> Nets</h2>
        <div className="text-sm text-gray-500">{nets.length} available</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {nets.map((n) => {
          const isSel = selected && selected._id === n._id;
          return (
            <button
              key={n._id}
              onClick={() => onSelect(n)}
              className={`p-4 rounded-lg border transition transform hover:shadow-lg hover:-translate-y-0.5 text-left ${
                isSel ? 'bg-brand-500 text-white' : 'bg-white'
              }`}
              title={n.name}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{n.name}</div>
                  <div className="text-sm text-gray-500">{n.location || 'Main ground'}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`text-xs px-2 py-1 rounded-full ${isSel ? 'bg-white text-brand-500' : 'bg-gray-100 text-gray-700'}`}>
                    {n.capacity > 1 ? `${n.capacity} pax` : '1 pax'}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">Net #{n._id.toString().slice(-4)}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
