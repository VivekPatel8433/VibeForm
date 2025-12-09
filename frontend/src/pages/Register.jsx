import React, { useState, useRef } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Bubbles (kept same, but added more blue tones)
  const bubbles = useRef(
    Array.from({ length: 15 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 20 + Math.random() * 40,
      delay: Math.random() * 5,
      color: ["#A0F8FF", "#6BE7FF", "#C7F9FF", "#D0F7FF"][Math.floor(Math.random() * 4)],
    }))
  ).current;

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
         email,
        password,
      });
      
      console.log(res.data);

      window.location.href = "/login"
    } catch (error) {
      console.log(error.response?.data || error);
      setMessage("Registration failed.");
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-200 via-cyan-100 to-purple-200 overflow-hidden">
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
        onSubmit={handleRegister}
        className="relative z-10 bg-white bg-opacity-30 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-white/40"
      >
        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-2 flex justify-center items-center gap-2 text-blue-500">
          <SparklesIcon className="w-6 h-6 text-blue-400 relative top-[1px]" />
            Create Account
        </h2>

        <p className="text-center text-blue-400 text-sm mb-6 opacity-80">
           Register your VibeForms account
        </p>


        {/* EMAIL */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full mb-4 px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:shadow-neon transition-all duration-300"
        />

        {/* PASSWORD */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full mb-6 px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:shadow-neon transition-all duration-300"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-[#00E5FF] text-white py-3 rounded-xl text-lg font-semibold
          hover:bg-[#00B8CC] hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-[0_0_20px_#00E5FF]"
        >
          Register
        </button>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-[#007A8A] font-medium">{message}</p>
        )}
        
      <p className="mt-4 text-sm flex justify-center">
        Already have an account?
      <Link className="text-blue-600 font-semibold ml-1" to="/login">
        Login
      </Link>
</p>

      </form>

      {/* CUSTOM ANIMATIONS */}
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

          .focus\\:shadow-neon:focus {
            box-shadow: 0 0 25px rgba(0, 229, 255, 0.7);
          }
        `}
      </style>
    </div>
  );
}
