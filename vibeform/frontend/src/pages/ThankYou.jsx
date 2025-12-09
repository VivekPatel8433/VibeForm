import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useNavigate, useLocation } from "react-router-dom";
import { Save, Smile, Star, Sparkles, Heart, ThumbsUp } from "lucide-react";
import axios from "axios";

export default function ThankYou({ onSave }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers, vibePoints, formTitle, formId } = location.state || {};

  const [showConfetti, setShowConfetti] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null); // For dev message

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const icons = [Smile, Star, Sparkles, Heart, ThumbsUp];
  const shareText = encodeURIComponent("I just completed a VibeForm!");
  const shareUrl = encodeURIComponent(window.location.href);

  const handleSaveForm = async () => {
    try {
      if (formId) {
        await axios.post(`${import.meta.env.VITE_API_URL}/responses/${formId}`, { answers, vibePoints });
      }

      if (onSave) onSave({ title: formTitle, answers, vibePoints, _id: formId });

      console.log(" Form saved successfully", { formTitle, answers, vibePoints });
      setSaveStatus("Form saved successfully!");
      navigate("/Dashboard");
    } catch (err) {
      console.error(" Error saving form", err);
      setSaveStatus("Error saving form. Check console.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-pink-300 via-purple-400 to-cyan-300 overflow-hidden px-4">
      {showConfetti && <Confetti numberOfPieces={250} recycle={false} />}

      <div className="text-center max-w-md w-full px-6 py-12 bg-white/20 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40">

        <h1 className="text-5xl font-extrabold text-white mb-4 neon-glow animate-neon-pulse">
          You're Awesome!
        </h1>

        <p className="text-2xl font-semibold text-gray-900 mb-6">{vibePoints} Vibe Points</p>

        {/* Floating Icons */}
        <div className="mb-8 flex justify-center gap-6 flex-wrap">
          {icons.map((Icon, index) => (
            <Icon key={index} size={40} className={`text-yellow-300`} />
          ))}
        </div>

        {/* Share Section */}
        <div className="mb-6 p-4 bg-white/30 rounded-xl shadow-lg border border-white/40">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Share your vibe!</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
            >
              Share on Twitter
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
            >
              Share on Facebook
            </a>
          </div>
        </div>

        {/* Save Form Button */}
        <button
          onClick={handleSaveForm}
          className="px-6 py-3 bg-green-500 text-white rounded-xl flex items-center gap-2 font-medium hover:bg-green-600 transition mb-4 w-full"
        >
          <Save size={20} /> Save Form
        </button>

        {saveStatus && <p className="text-sm text-gray-800 mb-4">{saveStatus}</p>}

        {/* Create Another Form */}
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition w-full"
        >
          Create Another Form
        </button>
      </div>
    </div>
  );
}
