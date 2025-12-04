import React from "react";

export default function Navbar({ isLoggedIn }) {
  return (
    <nav className="bg-pink-400 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">VibeForm</div>
      <div className="space-x-4">
        <a href="/dashboard" className="hover:text-yellow-200">Dashboard</a>
        <a href="/create" className="hover:text-yellow-200">Create Form</a>
        {isLoggedIn ? (
          <button className="bg-white text-pink-400 px-3 py-1 rounded hover:bg-yellow-200">
            Logout
          </button>
        ) : (
          <a href="/login" className="hover:text-yellow-200">Login</a>
        )}
      </div>
    </nav>
  );
}
