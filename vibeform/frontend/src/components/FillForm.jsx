import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Navbar from "./Navbar";

export default function FillForm({ form, onComplete = () => {}, startIndex = 0 }) {
  const questions = form.questions || [];
  const total = questions.length;

  const [index, setIndex] = useState(startIndex);
  const [answers, setAnswers] = useState({});
  const [vibePoints, setVibePoints] = useState(0);
  const [completed, setCompleted] = useState(false);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = Math.round((answeredCount / total) * 100);

  const recordAnswer = (qid, value, points = 10) => {
    const already = answers[qid] !== undefined;
    setAnswers(prev => ({ ...prev, [qid]: value }));

    if (!already) {
      setVibePoints(prev => prev + points);

      // small confetti for each answer
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.35 }
      });
    }
  };

  const goNext = () => {
    if (index < total - 1) setIndex(i => i + 1);
    else handleFinish();
  };

  const goBack = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  const handleFinish = () => {
    setCompleted(true);

    // big confetti on final completion
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.2 }
    });

    // callback to PreviewForm
    onComplete(answers, vibePoints);
  };

  // helper to render question by type
  const renderQuestion = (q) => {
    const qid = q.id;
    const currentAns = answers[qid];

    if (q.type === "text" || q.type === "short") {
      return (
        <input
          type="text"
          placeholder="Type your answer..."
          value={currentAns || ""}
          onChange={(e) => recordAnswer(qid, e.target.value, 5)}
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
              whileHover={{ scale: 1.03 }}
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

    if (q.type === "emoji" || q.type === "rating") {
      return (
        <div className="flex gap-4 text-4xl">
          {q.options.map(opt => (
            <motion.button
              key={opt}
              onClick={() => recordAnswer(qid, opt, 12)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.2 }}
              className={`p-2 rounded-lg ${currentAns === opt ? "scale-125" : ""}`}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      );
    }

    return <div>Unknown question type</div>;
  };

  return (
    <div>
      <Navbar isLoggedIn={false} />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-pink-600">{form.title}</h2>
              {form.description && <p className="text-sm text-gray-500">{form.description}</p>}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Vibe Points</div>
              <motion.div
                className="text-lg font-semibold text-pink-500"
                key={vibePoints}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {vibePoints} ✨
              </motion.div>
            </div>
          </div>

          {/* progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-6">
            <motion.div
              className="h-3 bg-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 80 }}
            />
          </div>

          {/* main card */}
          <div className="bg-white rounded-2xl shadow p-6">
            <AnimatePresence mode="wait">
              {!completed ? (
                <motion.div
                  key={questions[index].id}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.32 }}
                >
                  <div className="mb-4">
                    <div className="text-sm text-gray-400">Question {index + 1} / {total}</div>
                    <h3 className="text-xl font-semibold mt-2">{questions[index].label || questions[index].question}</h3>
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
              ) : (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <div className="text-4xl mb-3">🎉 All done!</div>
                  <div className="text-lg font-semibold text-pink-600 mb-2">
                    Your Vibe Score: {vibePoints} ✨
                  </div>
                  <p className="text-gray-600 mb-6">Thanks for vibing with us — feel free to share!</p>

                  <motion.button
                    onClick={() => onComplete(answers, vibePoints)}
                    className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save & Share
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
