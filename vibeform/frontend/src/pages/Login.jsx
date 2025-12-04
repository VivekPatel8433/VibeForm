import React, { useState, useRef, useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Generate bubbles once
  const bubbles = useRef(
    Array.from({ length: 15 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 20 + Math.random() * 40,
      delay: Math.random() * 5,
      color: ["#FDCFE8", "#B5EAEA", "#FFD6A5", "#D0C6FF"][Math.floor(Math.random() * 4)],
    }))
  ).current;

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("Logging in...");
    window.location.href="/CreateForm"
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 overflow-hidden">
      {/* Animated Bubbles */}
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-30 animate-bubble"
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
        className="relative z-10 bg-white bg-opacity-50 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-white/30"
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-pink-400 animate-pulse drop-shadow-lg">
          ✨ Login
        </h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full mb-4 px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:shadow-glow transition-all duration-300"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full mb-6 px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:shadow-glow transition-all duration-300"
        />

        <button
          type="submit"
          className="w-full bg-pink-400 text-white py-3 rounded-xl hover:bg-pink-500 hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-pink-400/60 text-lg font-semibold"
        >
          Login
        </button>

        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
      </form>

      <style>
        {`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes bubble-move {
            0% { transform: translateY(0) translateX(0); opacity: 0.3; }
            50% { transform: translateY(-30px) translateX(15px); opacity: 0.6; }
            100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          }
          .animate-bubble {
            animation: bubble-move 8s infinite ease-in-out;
            border-radius: 50%;
          }
          .focus\\:shadow-glow:focus {
            box-shadow: 0 0 20px rgba(255, 192, 203, 0.5);
          }
        `}
      </style>
    </div>
  );
}
