import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn }) {
  return (
    <nav className="bg-blue-400 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="text-2xl font-bold">VibeForm</div>

      <div className="space-x-4">
        <Link to="/Dashboard" className="hover:text-yellow-200">Dashboard</Link>

        <Link to="/CreateForm" className="hover:text-yellow-200">Create Form</Link>

        {isLoggedIn ? (
          <Link to="/Login" className="bg-white text-pink-400 px-3 py-1 rounded hover:bg-yellow-200"><button>Logout</button></Link>
        ) : (
          <Link to="/login" className="hover:text-yellow-200">Login</Link>
        )}
      </div>
    </nav>
  );
}
