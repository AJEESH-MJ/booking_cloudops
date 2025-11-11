import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.js';
import VisualNets from '../components/VisualNets.js';
import AvailabilityPanel from '../components/AvailabilityPanel.js';
import MyBookings from '../components/MyBookings.js';
import { API } from '../App.js';

export default function Main({ token, onLogout, currentUser }) {
  const [nets, setNets] = useState([]);
  const [selectedNet, setSelectedNet] = useState(null);
  const [loadingNets, setLoadingNets] = useState(true);
  const [netsError, setNetsError] = useState(null);
  const [activeTab, setActiveTab] = useState('book'); // book | bookings

  useEffect(() => {
    let mounted = true;
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    setLoadingNets(true);
    setNetsError(null);

    axios
      .get(`${API}/nets`, { headers })
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setNets(list);
        if (!selectedNet && list.length > 0) setSelectedNet(list[0]);
      })
      .catch((err) => {
        console.error('Failed to load nets', err);
        if (!mounted) return;
        setNets([]);
        setNetsError(err.response?.data?.error || err.message || 'Failed to load nets');
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingNets(false);
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  const activeNetsCount = nets.filter((n) => n.active !== false).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white">
      {/* Navbar */}
      <Navbar user={currentUser} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 text-transparent bg-clip-text">
            Nets Booking
          </h1>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-cyan-200">
              <span className="font-semibold text-white">{activeNetsCount}</span> Active Nets
            </div>
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin/nets"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-cyan-500 hover:to-indigo-600 transition-all rounded-md text-sm font-medium text-white shadow-lg shadow-indigo-700/40"
              >
                Manage Nets
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          {[
            { id: 'book', label: 'Book Nets' },
            { id: 'bookings', label: 'My Bookings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-medium transition-all rounded-t-md ${
                activeTab === tab.id
                  ? 'bg-white/10 text-cyan-300 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* === BOOK NETS TAB === */}
        {activeTab === 'book' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Nets */}
            <aside className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg hover:shadow-cyan-500/20 transition-all h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-cyan-300">Available Nets</h2>
                  <div className="text-sm text-gray-300">{activeNetsCount} active</div>
                </div>

                {loadingNets ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-white/10 rounded animate-pulse" />
                    ))}
                  </div>
                ) : netsError ? (
                  <div className="text-sm text-red-400">Error loading nets: {netsError}</div>
                ) : nets.length === 0 ? (
                  <div className="text-sm text-gray-300">
                    No nets found.
                    {currentUser?.role === 'admin' && (
                      <div className="mt-3">
                        <Link
                          to="/admin/nets"
                          className="inline-block px-3 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-md text-sm hover:scale-105 transform transition-all"
                        >
                          Create your first net
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <VisualNets
                    nets={nets}
                    selected={selectedNet}
                    onSelect={(n) => setSelectedNet(n)}
                  />
                )}
              </div>
            </aside>

            {/* Right Panel: Help + Availability */}
            <section className="lg:col-span-2 space-y-8">
              {/* Quick Help */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/20 transition-all">
                <h3 className="text-xl font-semibold text-indigo-300 mb-2">Quick Help</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Select a net on the left, choose a date, and check colored slots for availability.
                  Green slots are available, red are booked. Click a free slot to book.
                  Admins can manage nets and slots from the management panel.
                </p>
              </div>

              {/* Availability */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/20 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-cyan-300">Availability</h2>
                    <p className="text-sm text-gray-300 mt-1">
                      Pick a date to view available slots for your selected net.
                    </p>
                  </div>
                  <div className="text-sm text-gray-300">
                    {selectedNet ? (
                      <>
                        Selected: <span className="text-white font-medium">{selectedNet.name}</span>
                      </>
                    ) : (
                      'No net selected'
                    )}
                  </div>
                </div>

                <AvailabilityPanel selectedNet={selectedNet} token={token} />
              </div>
            </section>
          </div>
        )}

        {/* === MY BOOKINGS TAB === */}
        {activeTab === 'bookings' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-cyan-500/20 transition-all">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-6">My Bookings</h2>
            <MyBookings token={token} apiBase={API} />
          </div>
        )}
      </div>
    </div>
  );
}
