import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";

export default function Navbar({ user, onLogout }) {
  const displayName = user?.email
    ? user.email.split("@")[0].charAt(0).toUpperCase() +
      user.email.split("@")[0].slice(1)
    : "";

  return (
    <nav className="w-full bg-[#0a0f1f] border-b border-cyan-500/20 shadow-[0_2px_20px_rgba(0,255,255,0.05)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-white relative group"
        >
          <span className="text-cyan-400">Cricket</span>
          <span className="text-indigo-400">Arena</span>
          <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-400 group-hover:w-full transition-all duration-500"></div>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-6">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm text-cyan-300 font-medium border border-cyan-400/20 rounded-md px-3 py-1 hover:bg-cyan-500/10 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
            >
              Admin Panel
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 bg-[#111829] border border-cyan-400/20 px-4 py-2 rounded-xl shadow-inner hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {displayName.charAt(0)}
                </div>
                <span className="text-gray-200 text-sm font-medium tracking-wide">
                  {displayName}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 hover:scale-105 transition"
              >
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm text-cyan-300 font-medium hover:text-indigo-400 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
