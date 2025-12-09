import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import EmojiPicker from "emoji-picker-react";
import Confetti from "react-confetti";

export default function FillForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};
  const [answers, setAnswers] = useState(
    formData?.questions.map((q) => ({ id: q.id, answer: q.type === "emoji" ? [] : "" })) || []
  );
  const [showPicker, setShowPicker] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [xp, setXp] = useState(0);

  if (!formData) return <p>No form data found</p>;

  const handleChange = (qIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[qIndex].answer = value;
    setAnswers(newAnswers);
    handleCompletion(qIndex);
  };

  const handleEmojiClick = (qIndex, emoji) => {
    const newAnswers = [...answers];
    newAnswers[qIndex].answer.push(emoji.emoji);
    setAnswers(newAnswers);
    handleCompletion(qIndex);
  };

  const deleteEmoji = (qIndex, eIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex].answer.splice(eIndex, 1);
    setAnswers(newAnswers);
  };

  const handleCompletion = (qIndex) => {
    if (!completedQuestions.includes(qIndex)) {
      setCompletedQuestions([...completedQuestions, qIndex]);
      setXp((prev) => prev + 10); // Gain XP per answered question
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
      {/* Confetti when XP increases */}
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

            {/* Emoji */}
            {q.type === "emoji" && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {answers[index].answer.map((emo, eIndex) => (
                    <div
                      key={eIndex}
                      className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded animate-bounce"
                    >
                      <span className="text-2xl">{emo}</span>
                      <button
                        type="button"
                        onClick={() => deleteEmoji(index, eIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowPicker(showPicker === index ? null : index)}
                  className="px-3 py-1 bg-cyan-400 text-white rounded hover:bg-cyan-500 animate-bounce"
                >
                  + Select Emoji
                </button>

                {showPicker === index && (
                  <div className="mt-2 z-50">
                    <EmojiPicker
                      onEmojiClick={(emoji) => handleEmojiClick(index, emoji)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
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
        `}
      </style>
    </div>
  );
}
