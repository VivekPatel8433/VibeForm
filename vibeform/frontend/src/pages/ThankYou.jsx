import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { Smile, Star, Sparkles, Heart, ThumbsUp } from "lucide-react";

export default function ThankYou({ vibePoints = 20 }) {
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000); // Confetti lasts 5s
    return () => clearTimeout(timer);
  }, []);

  const icons = [Smile, Star, Sparkles, Heart, ThumbsUp]; // Dynamic icon list

  const shareText = encodeURIComponent("I just completed a VibeForm! 🎉 Check it out!");
  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-pink-300 via-purple-400 to-cyan-300 overflow-hidden">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

      <div className="text-center px-6 py-10 bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 animate-fade-in">
        <h1 className="text-5xl font-bold text-pink-500 mb-4 drop-shadow-neon animate-pulse">
          🎉 You’re awesome! 🎉
        </h1>
        <p className="text-xl text-gray-800 mb-6">
          +{vibePoints} Vibe Points earned
        </p>

        <div className="mb-6 flex justify-center gap-4 animate-bounce">
          {icons.map((Icon, index) => (
            <Icon key={index} size={32} className="text-yellow-400" />
          ))}
        </div>

        <div className="mb-6 p-4 bg-white/20 rounded-lg shadow-inner border border-white/30">
          <h2 className="text-lg font-semibold mb-2">Share your achievement!</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            >
              Share on Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition"
            >
              Share on Facebook
            </a>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-pink-400 text-white rounded-xl hover:bg-pink-500 hover:scale-105 transition-transform shadow-lg"
        >
          Create Another Form
        </button>
      </div>

      <style>
        {`
          @keyframes fade-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.5s ease-out; }

          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          .animate-bounce { animation: bounce 0.7s infinite; }

          .drop-shadow-neon { text-shadow: 0 0 8px #ff77ff, 0 0 12px #00ffff, 0 0 20px #ff77ff; }
        `}
      </style>
    </div>
  );
}
