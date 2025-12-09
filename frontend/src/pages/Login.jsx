import React, { useState, useRef } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Orange-themed bubbles
  const bubbles = useRef(
    Array.from({ length: 15 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 20 + Math.random() * 40,
      delay: Math.random() * 5,
      color: ["#FFE5C2", "#FFD4A9", "#FFC085", "#FFB066"][Math.floor(Math.random() * 4)],
    }))
  ).current;

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
       const res = await axios.post(`${BASE_URL}/auth/login`, {
  email,
  password,
});


      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

     window.location.href = "/createForm";
    } catch (error) {
      console.log(error.response?.data);
      setMessage(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100 overflow-hidden">
      {/* BUBBLES */}
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-40 animate-bubble"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            backgroundColor: b.color,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white bg-opacity-40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-white/40"
      >
        {/* TITLE */}
       <h2 className="text-3xl font-bold mb-2 flex justify-center items-center gap-2 text-orange-500">
          <SparklesIcon className="w-6 h-6 text-orange-400 relative top-[1px]" />
            Welcome Back
      </h2>

      <p className="text-center text-orange-400 text-sm mb-6 opacity-80">
         Login to your VibeForms account
      </p>


        {/* Email */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full mb-4 px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:shadow-orange-neon transition-all duration-300"
        />

        {/* Password */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full mb-6 px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:shadow-orange-neon transition-all duration-300"
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#FF8A00] text-white py-3 rounded-xl text-lg font-semibold hover:bg-[#FF7800] hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-[0_0_20px_#FF8A00]"
        >
          Login
        </button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-[#b84c00] font-medium">{message}</p>
        )}

        {/* Switch link */}
        <p className="mt-4 text-sm flex justify-center">
          Don’t have an account?
          <Link className="text-orange-600 font-semibold ml-1" to="/">
            Register
          </Link>
        </p>
      </form>

      {/* STYLES */}
      <style>
        {`
          @keyframes bubble-move {
            0% { transform: translateY(0) translateX(0); opacity: 0.4; }
            50% { transform: translateY(-30px) translateX(20px); opacity: 0.8; }
            100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          }

          .animate-bubble {
            animation: bubble-move 8s infinite ease-in-out;
          }

          .focus\\:shadow-orange-neon:focus {
            box-shadow: 0 0 25px rgba(255, 138, 0, 0.7);
          }
        `}
      </style>
    </div>
  );
}
