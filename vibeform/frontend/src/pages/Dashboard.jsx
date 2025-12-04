import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { sampleForms } from "../data/sampleForms";

export default function Dashboard() {
  const [forms, setForms] = useState(sampleForms);
  const [selectedForm, setSelectedForm] = useState(null);

  // Floating bubbles
  const bubbles = useRef(
    Array.from({ length: 12 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 20 + Math.random() * 40,
      delay: Math.random() * 5,
      color: ["#FDCFE8", "#B5EAEA", "#FFD6A5", "#D0C6FF"][Math.floor(Math.random() * 4)],
    }))
  ).current;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 overflow-hidden">
      {/* Floating bubbles */}
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-20 animate-bubble"
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

      <Navbar isLoggedIn={true} />

      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-pink-500 drop-shadow-lg animate-pulse">Dashboard</h1>

        {!selectedForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white/60 backdrop-blur-lg p-5 rounded-3xl shadow-lg hover:scale-105 hover:shadow-pink-400/50 transition-transform cursor-pointer"
                onClick={() => setSelectedForm(form)}
              >
                <h2 className="text-2xl font-semibold mb-1">{form.title}</h2>
                <p className="text-gray-500 text-sm mb-2">{form.description}</p>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <span>💌 {form.responses.length} responses</span>
                  <span className="ml-auto bg-pink-200 text-pink-700 px-2 py-1 rounded-full text-xs font-semibold">
                    {form.questions.length} Qs
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedForm(null)}
              className="mb-6 px-4 py-2 bg-pink-400 text-white rounded-xl hover:bg-pink-500 transition"
            >
              ← Back
            </button>

            <h2 className="text-3xl font-bold mb-2 text-pink-500">{selectedForm.title}</h2>
            <p className="text-gray-600 mb-6">{selectedForm.description}</p>

            {selectedForm.responses.length === 0 ? (
              <p className="text-gray-500">No responses yet. 😢</p>
            ) : (
              <div className="space-y-4">
                {selectedForm.responses.map((resp, idx) => (
                  <div
                    key={idx}
                    className="bg-white/60 backdrop-blur-lg p-4 rounded-2xl shadow hover:shadow-pink-400/50 transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Vibe Points: {resp.vibePoints} ✨</span>
                      <span className="text-xs text-pink-600 font-semibold">{Object.keys(resp.answers).length} answers</span>
                    </div>
                    <ul className="ml-4 list-disc text-gray-700">
                      {Object.entries(resp.answers).map(([qid, ans]) => (
                        <li key={qid}>
                          <strong>{qid}:</strong> {ans}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes bubble-move {
            0%,100% { transform: translateY(0) translateX(0); opacity: 0.2; }
            50% { transform: translateY(-20px) translateX(15px); opacity: 0.5; }
          }
          .animate-bubble {
            animation: bubble-move 8s infinite ease-in-out;
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
}
