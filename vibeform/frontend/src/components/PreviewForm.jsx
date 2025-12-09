import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Confetti from "react-confetti";

export default function FillForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};
  const [answers, setAnswers] = useState(
    formData?.questions.map((q) => ({ id: q.id, answer: q.type === "emoji" ? [] : "" })) || []
  );
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [xp, setXp] = useState(0);

  if (!formData) return <p>No form data found</p>;

  const handleChange = (qIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[qIndex].answer = value;
    setAnswers(newAnswers);
    handleCompletion(qIndex);
  };

  const handleEmojiSelect = (qIndex, emoji) => {
    const newAnswers = [...answers];
    // For single selection, replace array; for multi-selection, push
    if (!newAnswers[qIndex].answer.includes(emoji)) {
      newAnswers[qIndex].answer.push(emoji);
      setAnswers(newAnswers);
      handleCompletion(qIndex);
    }
  };

  const handleCompletion = (qIndex) => {
    if (!completedQuestions.includes(qIndex)) {
      setCompletedQuestions([...completedQuestions, qIndex]);
      setXp((prev) => prev + 10); // XP per question answered
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", answers);
    navigate("/thankyou");
  };

  const progress = Math.min(
    100,
    (completedQuestions.length / formData.questions.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-pink-300 to-purple-200 flex justify-center py-10 relative">
      {completedQuestions.length > 0 && <Confetti recycle={false} numberOfPieces={50} />}
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/20 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/30 animate-slide-in"
      >
        <h2 className="text-4xl font-bold mb-4 text-center text-pink-400 flex justify-center items-center gap-2 animate-pulse">
          <SparklesIcon className="w-8 h-8 text-pink-400" />
          {formData.title}
        </h2>

        {/* XP / Vibe Score */}
        <div className="mb-4 text-center text-lg font-semibold text-purple-700">
          XP: {xp}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 rounded-full bg-white/30 mb-6 overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {formData.questions.map((q, index) => (
          <div
            key={q.id}
            className="mb-6 border p-4 rounded-xl bg-white/30 backdrop-blur-md animate-fade-in"
          >
            <p className="font-semibold text-gray-800 mb-2">{q.question}</p>

            {/* Short Text */}
            {q.type === "short" && (
              <input
                type="text"
                value={answers[index].answer}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full px-3 py-2 border rounded bg-white/10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition transform hover:scale-105"
                placeholder="Type your answer..."
                required
              />
            )}

            {/* Multiple Choice */}
            {q.type === "multiple" && (
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oIndex) => (
                  <button
                    type="button"
                    key={oIndex}
                    onClick={() => handleChange(index, opt)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded hover:bg-white/20 transition transform hover:scale-105"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Emoji Question */}
            {q.type === "emoji" && (
              <div className="flex flex-wrap gap-3 mt-2">
                {q.options.map((emo, eIndex) => {
                  const selected = answers[index].answer.includes(emo);
                  return (
                    <button
                      key={eIndex}
                      type="button"
                      onClick={() => handleEmojiSelect(index, emo)}
                      className={`text-3xl p-2 rounded transition transform ${
                        selected
                          ? "scale-125 bg-pink-200 drop-shadow-neon"
                          : "hover:scale-110 hover:bg-white/20"
                      }`}
                    >
                      {emo}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          onSubmit={"/ThankYou"}
          className="w-full bg-pink-400 text-white py-3 rounded-xl hover:bg-pink-500 hover:scale-105 transition-transform duration-200 shadow-lg font-semibold text-lg animate-bounce"
        >
          Submit Form
        </button>
      </form>

      <style>
        {`
          @keyframes slide-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-slide-in { animation: slide-in 0.5s ease-out; }

          @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.5s ease-out; }

          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          .animate-bounce { animation: bounce 0.5s infinite; }

          .drop-shadow-neon { text-shadow: 0 0 8px #ff77ff, 0 0 12px #00ffff, 0 0 20px #ff77ff; }
        `}
      </style>
    </div>
  );
}
