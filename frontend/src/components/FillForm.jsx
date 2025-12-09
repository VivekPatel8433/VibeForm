import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FillForm({ form }) {
  const navigate = useNavigate();
  const questions = form?.questions || [];
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [vibePoints, setVibePoints] = useState(0);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = Math.round((answeredCount / total) * 100);

  const recordAnswer = (qid, value, points = 10) => {
    const already = answers[qid] !== undefined;
    setAnswers(prev => ({ ...prev, [qid]: value }));

    if (!already) {
      setVibePoints(prev => prev + points);
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.35 } });
    }
  };

  const goNext = () => index < total - 1 ? setIndex(i => i + 1) : handleFinish();
  const goBack = () => index > 0 && setIndex(i => i - 1);

  const handleFinish = async () => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.2 } });
    const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/responses/${form._id}`, {
        answers: payload,
        vibePoints
      });
      navigate("/ThankYou", { state: { vibePoints, formTitle: form.title, answers: payload } });
    } catch (err) {
      console.error("Error submitting response:", err);
      alert("Error submitting!");
    }
  };

  const renderQuestion = q => {
    const qid = q._id;
    const currentAns = answers[qid];

    if (q.type === "short" || q.type === "text") {
      return (
        <input
          type="text"
          placeholder="Type your answer..."
          value={currentAns || ""}
          onChange={e => recordAnswer(qid, e.target.value, 5)}
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      );
    }

    if (q.type === "multiple") {
      return (
        <div className="flex flex-col gap-3">
          {q.options.map(opt => (
            <motion.button
              key={opt}
              type="button"
              onClick={() => recordAnswer(qid, opt, 10)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`text-left p-3 rounded-xl border ${
                currentAns === opt ? "bg-pink-50 ring-2 ring-pink-300" : "bg-white"
              }`}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      );
    }

    if (q.type === "emoji") {
      const selectedEmojis = currentAns || [];
      return (
        <div className="flex gap-4 justify-center flex-wrap">
          {q.options.map(emoji => {
            const isSelected = selectedEmojis.includes(emoji);
            const toggleEmoji = () => {
              const newAns = isSelected ? selectedEmojis.filter(e => e !== emoji) : [...selectedEmojis, emoji];
              recordAnswer(qid, newAns, 12);
            };
            return (
              <button
                key={emoji}
                onClick={toggleEmoji}
                className={`text-4xl p-3 rounded-full border ${isSelected ? "bg-yellow-200" : "bg-gray-200"}`}
              >
                {emoji}
              </button>
            );
          })}
        </div>
      );
    }

    return <div>Unknown question type</div>;
  };

  if (!form) return <p>Loading form...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col">
      <Navbar isLoggedIn={false} />

      <div className="flex-grow flex justify-center p-6">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-pink-600">{form.title}</h2>
              {form.description && <p className="text-sm text-gray-500">{form.description}</p>}
            </div>
            <div className="text-right flex flex-col items-center">
              <div className="text-xs text-gray-400">Vibe Points</div>
              <motion.div
                key={vibePoints}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-lg font-semibold text-pink-500"
              >
                {vibePoints}
              </motion.div>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-3 bg-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 80 }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow p-6 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={questions[index]._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <div className="text-sm text-gray-400">Question {index + 1} / {total}</div>
                  <h3 className="text-xl font-semibold mt-2">{questions[index].question}</h3>
                </div>

                <div className="mb-6">{renderQuestion(questions[index])}</div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={goBack}
                    disabled={index === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-40"
                  >
                    Back
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500 mr-2">{answeredCount} answered</div>
                    <button
                      onClick={goNext}
                      className="px-5 py-2 rounded-lg bg-pink-500 text-white shadow hover:bg-pink-600"
                    >
                      {index === total - 1 ? "Finish" : "Next"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
