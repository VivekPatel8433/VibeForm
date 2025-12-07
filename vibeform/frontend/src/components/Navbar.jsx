import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"; // For Icons

export default function Navbar({ isLoggedIn }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-red-400 text-white p-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold drop-shadow-lg animate-pulse text-green-100">VibeForm</div>

        {/* Hamburger button */}
        <button
          className="sm:hidden block"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <Bars3Icon className="w-8 h-8" />
          )}
        </button>

        {/* Desktop menu */}
        <div className="hidden sm:flex space-x-4">
          <Link to="/Dashboard" className="hover:text-yellow-200">Dashboard</Link>
          <Link to="/CreateForm" className="hover:text-yellow-200">Create Form</Link>

          {isLoggedIn ? (
            <Link
              to="/Login"
              className="bg-white text-pink-400 px-3 py-1 rounded hover:bg-yellow-200"
            >
              Logout
            </Link>
          ) : (
            <Link to="/login" className="hover:text-yellow-200">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden flex flex-col space-y-2 mt-3">
          <Link to="/Dashboard" className="hover:text-yellow-200">Dashboard</Link>
          <Link to="/CreateForm" className="hover:text-yellow-200">Create Form</Link>

          {isLoggedIn ? (
            <Link
              to="/Login"
              className="bg-white text-pink-400 px-3 py-1 rounded hover:bg-yellow-200 w-fit"
            >
              Logout
            </Link>
          ) : (
            <Link to="/login" className="hover:text-yellow-200">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
